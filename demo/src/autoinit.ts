import Turntable from './turntable.ts';

if (!(window as any).Turntable) {
  (window as any).Turntable = new Turntable();
}
(window as any).Turntable.initAll();
