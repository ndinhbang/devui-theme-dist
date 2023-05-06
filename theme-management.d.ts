import { Subscription } from 'rxjs';
import { Theme } from './theme';
import { ThemeService } from './theme-service';
/**
 * usage
 * main.ts
 ```ts
 import { ThemeServiceInit } from 'devui-theme';
 ThemeServiceInit();
 ```
 *
*/
export declare function ThemeServiceInit(themes?: {
    [themeName: string]: Theme;
}, defaultThemeName?: string, extraData?: {
    [themeName: string]: {
        appendClasses?: Array<string>;
        cssVariables?: {
            [cssVarName: string]: string;
        };
    };
}, ieSupport?: boolean, // TODO：css-var-ponyflll 仍有一些问题待定位
allowDynamicTheme?: boolean): ThemeService | null;
export declare function ThemeServiceFollowSystemOn(themeConfig?: {
    lightThemeName: string;
    darkThemeName: string;
}): Subscription | null;
export declare function ThemeServiceFollowSystemOff(sub?: Subscription): null | undefined;
export declare function ieSupportCssVar(): null | undefined;
