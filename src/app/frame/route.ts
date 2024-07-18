import { NextRequest, NextResponse } from "next/server"
import { getConnectedAddressForUser } from "../../../utils/fc";
import { mintNft, numberOfNFTMints } from "../../../utils/mint";

import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK({
    pinata_jwt: process.env.PINATA_JWT as string,
    pinata_gateway: process.env.GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const frameMetadata = fdk.getFrameMetadata({
            cid: "QmfJVQk2nszevbyEGJntcVAciKGEGQrBJR4gCWb78hBqi9/0.png",
            post_url: `${process.env.BASE_URL}/frame`,
            buttons: [{ label: "Mint NFT", action: "post" }],
            aspect_ratio: "1:1",

        });
        return new NextResponse(frameMetadata);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error });
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const fid = body.untrustedData.fid;
    const address = await getConnectedAddressForUser(fid);
    const balance = await numberOfNFTMints(address);
    console.log(balance);
    if (typeof balance === "number" && balance !== null && balance < 2) {
        try {
            const mint = await mintNft(address);
            console.log(mint);
            const frameMetadata = fdk.getFrameMetadata({
                post_url: `${process.env.BASE_URL}/redirect`,
                buttons: [{ label: "Learn How to Make This", action: "post_redirect" }],
                aspect_ratio: "1:1",
                cid: "QmWkgGBCZuDTXVsv8H94SdpHoHV3eE7USHce6zd5LK3qqp",
            });
            return new NextResponse(frameMetadata);
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: error });
        }
    } else {
        const frameMetadata = fdk.getFrameMetadata({
            post_url: `${process.env.BASE_URL}/redirect`,
            aspect_ratio: "1:1",
            cid: "QmWkgGBCZuDTXVsv8H94SdpHoHV3eE7USHce6zd5LK3qqp",
        });
        return new NextResponse(frameMetadata);
    }
}