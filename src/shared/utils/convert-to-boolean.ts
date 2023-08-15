export const convertToBoolean = (value: string) => {
  try {
    return JSON.parse(value.toLowerCase());
  } catch (error) {
    return 'error';
  }
};
