import { NextRequest, NextResponse } from "next/server"
import { getConnectedAddressForUser } from "../../../utils/fc";
import { balanceOf, mintNft } from "../../../utils/mint";

import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK({
    pinata_jwt: process.env.PINATA_JWT as string,
    pinata_gateway: process.env.GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const frameMetadata = fdk.getFrameMetadata({
            image: { url: "https://amaranth-genuine-kangaroo-139.mypinata.cloud/ipfs/QmfJVQk2nszevbyEGJntcVAciKGEGQrBJR4gCWb78hBqi9/0.png" },
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
    const balance = await balanceOf(address, 0);
    console.log(balance);
    if (typeof balance === "number" && balance !== null && balance < 1) {
        try {
            const mint = await mintNft(address, 0);
            console.log(mint);
            const frameMetadata = fdk.getFrameMetadata({
                buttons: [{ label: "Go to Dashboard", action: "link", target: `https://nexus-wheat-pi.vercel.app/dashboard`}],
                aspect_ratio: "1:1",
                image: { url: "https://scarlet-calm-porcupine-918.mypinata.cloud/ipfs/QmQ4TreCgZFdi69i5fBnieiZpRYfiREvdRiR6XXWP2KUuZ" },
            });
            return new NextResponse(frameMetadata);
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: error });
        }
    } else {
        const frameMetadata = fdk.getFrameMetadata({
            buttons: [{ label: "Go to Dashboard", action: "link", target: `https://nexus-wheat-pi.vercel.app/dashboard`}],
            aspect_ratio: "1:1",
            image: { url: "https://scarlet-calm-porcupine-918.mypinata.cloud/ipfs/QmQif94kG157UGFpwkVV7omvJL77TzgujKvUz5cTSsSy62" },
        });
        return new NextResponse(frameMetadata);
    }
}