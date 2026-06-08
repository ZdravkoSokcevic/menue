<?php

namespace App\Console\Commands;

use ErrorException;
use File;
use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Http;

use \App\Models\Country;
use \App\Models\Currency;
use \App\Models\Language;

class CountriesDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:countries-data-sync';
    protected $apiURL = 'https://restcountries.com/v3.1/all?fields=codes,currencies,flags,languages,name,numericCode,translations,flag,region,tld';
    
    /**
     * The console command description.
    *
    * @var string
    */
    protected $description = 'Sync countries data from an external API';

    protected $imperialCountryNames = [
        'United States',
        'Cook Islands',
        'Liberia',
        'Myanmar',
        'United Kingdom',
        'Canada'
    ];

    protected function isFrequentCountry(string $name) {
        $frequent_array = [
            'United States',
            'United Kingdom',
            'France',
            'Switzerland',
            'Austria',
            'Slovenia',
            'Czech Republic',
            'Poland',
            'Slovakia',
            'Monaco',
            'Liechtenstein',
            'Hungary',
            'Germany',
            'Italy',
            'Spain',
            'Serbia',
            'Portugal',
            'Ireland',
            'Iceland',
            'Russia',
            'Brasil',
            'China',
            'India',
            'Pakistan',
            'Iran',
            'Saudi Arabia',
            'United Arab Emirates',
            'Egypt',
            'Colombia',
            'Argentina',
            'Romania',
            'Bosnia and Herzegovina',
            'Croatia',
            'Sweden',
            'Norway',
            'Denmark',
            'Estonia'
        ];
        return in_array($name, $frequent_array);
    }

    protected function isMandatoryCountry(string $name)
    {
        $frequent_array = [
            'United States',
            'United Kingdom',
            'France',
            'Switzerland',
            'Austria',
            'Germany',
            'Italy',
            'Spain',
            'Portugal',
        ];
        return in_array($name, $frequent_array);   
    }


    protected function insertCountry(array $countryData): Country | null
    {
        // check if country exists
        $exists = Country::where('common_name', $countryData['name']['common'])->first();
        if($exists)
            return $exists;

        // insert main language

        $main_currency = null;
        $main_language = null;
        // insert main currency
        if(count($countryData['currencies'])) {
            $mainCurrencyContent = [];
            // dd($countryData['currencies']);
            $currencyData = $countryData['currencies'];
            foreach($currencyData as $k => $val) {
                $mainCurrencyContent['code'] = $k;
                $mainCurrencyContent['name'] = $val['name'];
                $mainCurrencyContent['symbol'] = $val['symbol'];
            }

            // search of existed curencies
            $existedCurrency = Currency::where('code', $mainCurrencyContent['code'])->first();

            if(!$existedCurrency) {
                $currency = new Currency($mainCurrencyContent);
                if($currency->save())
                    $main_currency = $currency->id;
            }else $main_currency = $existedCurrency->id;
        }

        if(count($countryData['languages'])) {
            $mainLanguageContent = [];
            $language = $countryData['languages'];
            foreach($language as $k => $val) {
                $mainLanguageContent['code'] = $k;
                $mainLanguageContent['name'] = $val;
            }

            // search of existed language to prevent duplicates
            $existedLang = Language::where('code', $mainLanguageContent['code'])->first();

            if(!$existedLang) {
                $lang = new Language($mainLanguageContent);
                if($lang->save())
                    $main_language = $lang->id; 
            }else $main_language = $existedLang->id;
        }

        $tld = null;
        if(isset($countryData['tld']) && is_array($countryData['tld']))
            $tld = @$countryData['tld'][0];
        else if(!is_string($countryData['tld']))
            $tld = $countryData['tld'];


        $country = new Country([
            'common_name'   => $countryData['name']['common'],
            'name'          => $countryData['name']['official'],
            'flag'          => $countryData['flag'],
            'flag_png'      => $countryData['flags']['png'],
            'flag_svg'      => $countryData['flags']['svg'],
            'region'        => $countryData['region'],
            'tld'           => $tld,
            'currency_id'   => $main_currency,
            'language_id'   => $main_language,
            'frequent'      => $this->isFrequentCountry($countryData['name']['common']),
            'use_imperial'  => in_array($countryData['name']['common'], $this->imperialCountryNames),
            'mandatory'     => $this->isMandatoryCountry($countryData['name']['common'])
        ]);

        // dd($country->attributesToArray());

        if($country->save())
            return $country;
        else return null;

        return null;
    }

    protected function insertCurrencies(array $currencies): array | null
    {
        $currencyIds = [];
        foreach($currencies as $currencyCode => $currencyData) {
            // Check if currency is already in database,
            // to prevent duplicates
            $exists = Currency::where('code', $currencyCode)->first();
            if($exists) {
                $currencyIds[] = $exists->id;
                continue;
            }
            $currency = new Currency([
                'code'      => $currencyCode,
                'name'      => $currencyData['name'],
                'symbol'    => $currencyData['symbol']
            ]);

            if($currency->save())
                $currencyIds[] = $currency->id;
        }

        return $currencyIds;
    }

    protected function insertLanguages(array $languages): array | null
    {
        $languageIds = [];
        foreach($languages as $languageCode => $languageName) {
            // Check if currency is already in database,
            // to prevent duplicates
            $exists = Language::where('code', $languageCode)->first();
            if($exists) {
                $languageIds[] = $exists->id;
                continue;
            }
            $lang = new Language([
                'code'      => $languageCode,
                'name'      => $languageName,
            ]);

            if($lang->save())
                $languageIds[] = $lang->id;
        }

        return $languageIds;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $res = null;
        $countries = null;
        // $res = [ Http::get('https://restcountries.com/v3.1/all?fields=name,currencies,flags') ];
        // $res = [];
        try {
            $local_file_path = database_path('data/countries.json');
            $json = File::get($local_file_path);
            if($json) {
                $countries = json_decode($json, true);
            }else {
                $res = Http::get($this->apiURL);
                $success = $res->successful();
                if($success) {
                    $countries = $res->json();
                    File::put($local_file_path, json_encode($countries));
                }else {
                    throw new ErrorException('Could not obtain countries list');
                }
            }
        }catch (FileNotFoundException $e) {
            $res = Http::get($this->apiURL);
            $success = $res->successful();
            if($success) {
                $countries = $res->json();
                File::put($local_file_path, json_encode($countries));
            }else {
                throw new ErrorException('Could not obtain countries list');
            }
        }


        if(is_null($countries)) {
            throw new ErrorException('Could not obtain countries list');
        }

        foreach($countries as $countryData) {
            // dd($countryData);
            $country = $this->insertCountry($countryData);

            // return all currencies
            $currencies = $this->insertCurrencies($countryData['currencies']);

            // associate country model with all currencies
            if(count($currencies))
                $country->currencies()->sync($currencies);

            // associate country model with all languages
            $languages = $this->insertLanguages($countryData['languages']);
            if(count($languages))
                $country->languages()->sync($languages);

        }


        echo "Countries, currencies, languages created succesfully!\n";

        // if($res->successful()) {

        // }
    }
}
