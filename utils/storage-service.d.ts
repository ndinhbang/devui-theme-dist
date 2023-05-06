import { IStorageService } from './interface';
export declare class StorageService implements IStorageService {
    tryGetLocalStorage(key: string): string | null;
    trySetLocalStorage(key: string, value: any): void;
}
