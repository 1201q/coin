import CircleLoading from '@/public/loading.svg';

const ChartLoading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100% - 40px)',
      }}
    >
      <CircleLoading width={70} height={70} />
    </div>
  );
};

export default ChartLoading;
