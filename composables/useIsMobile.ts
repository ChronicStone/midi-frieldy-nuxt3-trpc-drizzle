import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

export const useIsMobile = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const smallDevice = breakpoints.smaller("lg");
  return smallDevice;
};
