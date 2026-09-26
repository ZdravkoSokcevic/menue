<?php
namespace App\Services;

use App\Models\User;

class CompanyContextService
{
    /**
     * Issue new token with company_id restrictions
     * @param User $user
     * @param int $companyId
     * @return string
     */
    public function issueCompanyToken(User $user, int $companyId): string
    {
        // Revoke current token
        if($user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        // Issue new token containing company_id
        return $user->createToken(
            'switched-context-token',
            ["company-context: {$companyId}"]
        )->plainTextToken;
    }

    /**
     * Clean token without company_id
     */
    public function issueCleanToken(User $user): string 
    {
        // Revoke current token
        if($user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return $user->createToken($user->username.'-AuthToken', ['*'])->plainTextToken;
        // return $user->createToken('standard-token', ['*'])->plainTextToken;
    }
}