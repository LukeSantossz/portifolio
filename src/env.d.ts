/// <reference types="astro/client" />

// Fontsource variable packages are imported only for their CSS side effect and
// ship no type declarations; declare them so `astro check` (strict) passes.
declare module '@fontsource-variable/*';
