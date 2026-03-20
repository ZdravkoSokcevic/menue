import { WidthHeight } from "@/types/Media";

class MediaHelper
{
    static SUPPORTED_IMAGE_FORMATS=[ 'image/jpg', 'image/jpeg', 'image/gif', 'image/png' ];
    // Maximum 3mb for now
    static MAXIMUM_IMAGE_FILE_SIZE = 3 * 1024 * 1024;
    static isMenuImageAspectRatioOK(dimensions: any): boolean {
        return true;
    }

    /**
     * Helper function to create a FileList from an array of File objects.
     * @params {File[]} files - Array of files to add to the FileList
     */
    static fileListFrom(files: File[]) {
    const dataTransfer = new DataTransfer();
    for (const file of files) {
        dataTransfer.items.add(file);
    }
    return dataTransfer.files;
    }

    static getFileDimensions(file: File): Promise<WidthHeight> {
        const url = window.URL.createObjectURL(file);
        return new Promise<WidthHeight>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onerror = reject;
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight } as WidthHeight);
        };
        }).finally(() => {
        // Release the object URL once dimensions are obtained
        window.URL.revokeObjectURL(url);
    });
}
}

export default MediaHelper;