interface StorageGetOptions {
    key: string
}

interface StorageSetOptions {
    key: string,
    value: string
}

class Storage
{
    static async get(options: string){
        return localStorage.getItem(options);
    }
    
    static async set(options: StorageSetOptions){
        localStorage.setItem(options.key, options.value);
    }

    static async remove(options: StorageGetOptions) {
        localStorage.removeItem(options.key);
    }
}

export default Storage;