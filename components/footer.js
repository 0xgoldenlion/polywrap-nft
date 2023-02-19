
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 mb-5 flex items-center justify-center space-x-5">
      <div>
       
      </div>
      <div className="text-white ">&#8226;</div>
      <div>
      <Link href="https://goerli.etherscan.io/address/0xA3AF26DFa3e5DC60C3c334c34711c702E06dAAbB">
          <a className="text-white hover:underline">Contract Address</a>
        </Link>
      </div>
    </footer>
  );
}
