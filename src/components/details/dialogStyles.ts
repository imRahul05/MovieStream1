/** Shared open/close animation language for the details + DMCA dialogs. */
export const dialogBackdropClass =
  'fixed inset-0 z-50 bg-black/70 backdrop-blur-xl transition-[opacity,backdrop-filter] duration-500 ease-(--ease-out-expo) data-starting-style:opacity-0 data-starting-style:backdrop-blur-none data-ending-style:opacity-0 data-ending-style:backdrop-blur-none data-ending-style:duration-200';

export const dialogPanelMotion =
  'transition-[opacity,scale,filter,translate] duration-500 ease-(--ease-out-expo) data-starting-style:opacity-0 data-starting-style:scale-95 data-starting-style:blur-md data-ending-style:opacity-0 data-ending-style:scale-[0.97] data-ending-style:blur-sm data-ending-style:duration-200';

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
