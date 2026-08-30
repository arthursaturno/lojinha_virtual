type BrandProps = {
  storeName: string;
};

export function Brand({ storeName }: BrandProps) {
  return (
    <div className="max-w-[150px]">
      <strong className="block break-words text-[23px] font-black italic leading-none tracking-[-0.08em] text-white md:text-[28px]">
        {storeName}
      </strong>
    </div>
  );
}
