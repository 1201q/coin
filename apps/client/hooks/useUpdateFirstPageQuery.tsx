import { useCallback, useState } from 'react';
import { PriceChartOption, selectedPriceChartOptionAtom } from '@/store/chart';
import { PriceChart } from '@/types/upbit';
import { fetchCandleData } from '@/utils/chart';
import { parseTime } from '@/utils/time';
import { useAtomValue } from 'jotai';
import { queryClientAtom } from 'jotai-tanstack-query';

export const useUpdateFirstPageQuery = (code: string) => {
  const queryClient = useAtomValue(queryClientAtom);
  const options = useAtomValue(selectedPriceChartOptionAtom);
  const [isLoading, setIsLoading] = useState(true);

  const updateFirstPageQuery = useCallback(() => {
    setIsLoading(true);

    fetchLatestCandles(code, options).then((data) => {
      if (data) {
        setFirstPageQuery(code, data, queryClient, options);
        setIsLoading(false);
      }
    });
  }, [code, options, queryClient]);

  return { updateFirstPageQuery, isLoading };
};

const fetchLatestCandles = async (
  code: string,
  options: PriceChartOption,
): Promise<PriceChart[] | undefined> => {
  try {
    const res = await fetchCandleData({
      market: code,
      type: options.type,
      unit: options.minutes,
    });
    return res.convertedData;
  } catch (error) {
    console.error(error);
  }
};

const setFirstPageQuery = (
  code: string,
  fetchedData: PriceChart[],
  queryClient: any,
  options: PriceChartOption,
) => {
  queryClient.setQueryData(
    ['candle', code, options.type, options.minutes],
    (oldData: { pages: PriceChart[][]; pagesParams: string[] }) => {
      if (!oldData || !oldData.pages || oldData.pages.length === 0)
        return oldData;

      const firstPage = [...oldData.pages[0]];
      const firstCandle = firstPage[0];

      const sortedData = fetchedData.sort(
        (a, b) => parseTime(a.time) - parseTime(b.time),
      );

      const fetchedIndex = sortedData.findIndex(
        (item) => item.time === firstCandle.time,
      );

      if (fetchedIndex === -1) {
        return {
          ...oldData,
          pages: [sortedData, ...oldData.pages.slice(1)],
        };
      }

      const updatedFirstPage = sortedData.slice(fetchedIndex);
      console.log(updatedFirstPage);

      return {
        ...oldData,
        pages: [updatedFirstPage, ...oldData.pages.slice(1)],
      };
    },
  );
};
