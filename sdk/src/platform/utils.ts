export const delay = (timeout): Promise<any> =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, timeout);
    });
