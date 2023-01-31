import { ProductType } from './../db/index';
import { useMemo } from 'react';
export default function useAmount(
  data: ProductType[],
  completedData: ProductType[]
) {
  const amount = useMemo(() => {
    const length = data?.length;
    const completedLength = completedData?.length ?? 0;
 
    if (length && completedLength) {
      const percentage = Math.floor((completedLength / length) * 100);


      console.log("completedLength", completedLength)
      console.log("length", length)
      console.log(`${percentage}%`);

      return {
        length,
        completedLength,
        percentage,
      };
    }
    return null;
  }, [completedData?.length, data?.length]);

  return { amount };
}
