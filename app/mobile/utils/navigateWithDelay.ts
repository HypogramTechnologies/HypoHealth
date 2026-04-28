
export const navigateWithDelay = async (
  action: () => void, 
  delay: number = 2000
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  action();
};