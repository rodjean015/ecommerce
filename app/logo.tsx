import Image from "next/image";

export function Logo({
  height = 32,
  responsive = true,
}: {
  height?: number;
  responsive?: boolean;
}) {
  if (!responsive) {
    return (
      <Image
        src="/logo-full.png"
        alt="CheckMeOutPH"
        width={1054}
        height={286}
        priority
        style={{ height, width: "auto" }}
      />
    );
  }

  return (
    <>
      <Image
        src="/logo-icon.png"
        alt="CheckMeOutPH"
        width={327}
        height={286}
        priority
        style={{ height, width: "auto" }}
        className="sm:hidden"
      />
      <Image
        src="/logo-full.png"
        alt="CheckMeOutPH"
        width={1054}
        height={286}
        priority
        style={{ height, width: "auto" }}
        className="hidden sm:block"
      />
    </>
  );
}
