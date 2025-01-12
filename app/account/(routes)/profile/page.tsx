import React, { FC } from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const AccountPage: FC<Props> = async ({ params, searchParams }) => {
  const filters = (await searchParams).filters;
  const slug = (await params).slug;
  const { register, login, query = "" } = await searchParams;
  return <div className="">Profile</div>;
};

export default AccountPage;
