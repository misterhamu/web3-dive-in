"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";

import MyContractABI from "../app/assets/MyContract.json";
import { Button, Input } from "@nextui-org/react";

function Page() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const getNumber = useContractRead({
    address: "0xE5b37902Bc167b9374F7F93Db72E07F3C14960b3",
    abi: MyContractABI.abi,
    functionName: "get",
    args: [],
    onSuccess(data) {
      console.log("Success : ", data);
    },
    onError(error) {
      console.log(error.message);
    },
  });

  const setNumberConfig = usePrepareContractWrite({
    address: "0xE5b37902Bc167b9374F7F93Db72E07F3C14960b3",
    abi: MyContractABI.abi,
    functionName: "set",
    args: [currentNumber],
  });

  const setNumber = useContractWrite({
    ...setNumberConfig.config,
    onMutate() {},
    onError(err) {
      console.log("Error", setNumber.error);
      setNumber?.reset();
    },
    onSuccess() {},
    onSettled() {},
  });

  const waitForTransaction = useWaitForTransaction({
    hash: setNumber.data?.hash,
    onSuccess() {
      getNumber.refetch();
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>

      <div className="flex flex-col gap-6 justify-center items-center">
        <h1 className="text-4xl">Number: {Number(getNumber.data)}</h1>

        <div className="flex gap-3 items-center justify-center">
          <Input
            type="number"
            className="text-3xl disabled:bg-slate-400"
            variant="bordered"
            disabled={
              setNumber.isLoading ||
              waitForTransaction.isLoading ||
              waitForTransaction.isFetching ||
              waitForTransaction.isRefetching
            }
            onChange={(e) => {
              setCurrentNumber(Number(e.target.value));
            }}
          ></Input>
          <Button
            size="lg"
            color="danger"
            className="px-12 text-xl text-white rounded-lg"
            isDisabled={
              setNumber.isLoading ||
              waitForTransaction.isLoading ||
              waitForTransaction.isFetching ||
              waitForTransaction.isRefetching
            }
            isLoading={
              setNumber.isLoading ||
              waitForTransaction.isLoading ||
              waitForTransaction.isFetching ||
              waitForTransaction.isRefetching
            }
            onClick={() => {
              setNumber.write?.();
            }}
          >
            Add number
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page;
