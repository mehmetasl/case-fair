declare global {
  // Using var here is intentional as it represents the global scope
  // eslint-disable-next-line no-var
  var mongoose: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conn: any | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promise: Promise<any> | null;
  };
} 