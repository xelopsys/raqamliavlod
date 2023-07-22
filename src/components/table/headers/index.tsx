"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TrophyIcon } from "@heroicons/react/24/solid";

export function Headers() {
  const contestRowCol: ColumnDef<any>[] = [
    {
      header: "ID",
      footer: "id",
      accessorKey: "id",
    },
    {
      header: "Nomi",
      footer: "name",
      accessorKey: "name",
    },
    {
      header: "Masalalar",
      footer: "problemSets",
      accessorKey: "problemSets",
    },
    {
      header: "Qatnashuvchilar",
      footer: "participants",
      accessorKey: "participants",
    },
    {
      header: "Boshlanish vaqti",
      footer: "startedDate",
      accessorKey: "startedDate",
    },
    {
      header: "Tugash vaqti",
      footer: "endDate",
      accessorKey: "endDate",
    },
    {
      header: "Holati",
      footer: "status",
      accessorKey: "status",
    },
  ];
  const usersRowCol: ColumnDef<any>[] = [
    {
      header: "O`rni",
      footer: "rank",
      accessorKey: "rank",
      cell: ({ row }: any) => {
        if (row.original?.rank === 1) {
          return (
            <div className="flex flex-row items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-yellow-500">{row.original?.rank}</span>
            </div>
          );
        }
        if (row.original?.rank === 2) {
          return (
            <div className="flex flex-row items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-500">{row.original?.rank}</span>
            </div>
          );
        }
        if (row.original?.rank === 3) {
          return (
            <div className="flex flex-row items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-orange-500">{row.original?.rank}</span>
            </div>
          );
        }
        return (
          <div className="flex flex-row items-center justify-center">
            <span className="text-black">{row.original?.rank}</span>
          </div>
        );
      },
    },
    {
      header: "To`liq ismi",
      footer: "fullName",
      accessorKey: "fullName",
    },
    {
      header: "Masalalar balli",
      footer: "problemSetScore",
      accessorKey: "problemSetScore",
    },
    {
      header: "Tanlovlar balli",
      footer: "contestScore",
      accessorKey: "contestScore",
    },
    {
      header: "O`qish joyi",
      footer: "studyPlace",
      accessorKey: "studyPlace",
    },
  ];

  const participantsRowCol: ColumnDef<any>[] = [
    {
      header: "ID",
      footer: "userId",
      accessorKey: "userId",
    },
    {
      header: "To`liq ismi",
      footer: "userFullName",
      accessorKey: "userFullName",
    },
    {
      header: "Tanlovlar balli",
      footer: "userContestCoins",
      accessorKey: "userContestCoins",
    },
    {
      header: "Masalalar balli",
      footer: "userProblemSetCoins",
      accessorKey: "userProblemSetCoins",
    },
    {
      header: "Rasmi",
      footer: "userImageUrl",
      accessorKey: "userImageUrl",
      cell: ({ row }: any) => {
        if (row.original?.userImageUrl) {
          return (
            <img
              src={
                `${process.env.NEXT_PUBLIC_URL}${row.original.userImageUrl}` ||
                ""
              }
              loading="eager"
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          );
        }
        return <span>Rasm yo{"'"}q</span>;
      },
    },
  ];

  const problemSetRowCol: ColumnDef<any>[] = [
    {
      header: "ID",
      footer: "id",
      accessorKey: "id",
    },
    {
      header: "Nomi",
      footer: "name",
      accessorKey: "name",
    },
    {
      header: "Yuborilgan barcha yechimlar",
      footer: "numberOfAllSubmissions",
      accessorKey: "numberOfAllSubmissions",
    },
    {
      header: "To`g`ri yechimlar",
      footer: "numberOfCorrectSubmissions",
      accessorKey: "numberOfCorrectSubmissions",
    },
    {
      header: "Qatnashuvchilar soni",
      footer: "numberOfParticipants",
      accessorKey: "numberOfParticipants",
    },
    {
      header: "Qiyinlik foizi",
      footer: "difficulty",
      accessorKey: "difficulty",
      cell: ({ row }: any) => {
        return <span>{row.original?.difficulty}%</span>;
      },
    },
    {
      header: "Qiyinligi darajasi",
      footer: "type",
      accessorKey: "type",
    },
  ];

  const standingsRowCol: ColumnDef<any>[] = [
    {
      header: "№",
      footer: "userId",
      accessorKey: "userId",
    },
    {
      header: "Ishtirokchi",
      footer: "user",
      accessorKey: "user",
    },
    {
      header: "To`g`ri yechimlar",
      footer: "correctSubmission",
      accessorKey: "correctSubmission",
    },
    {
      header: "Noto`g`ri yechimlar",
      footer: "errorSubmissions",
      accessorKey: "errorSubmissions",
    },
    {
      header: "To`g`irlangan masalalar",
      footer: "fixedProblemSets",
      accessorKey: "fixedProblemSets",
    },
    {
      header: "Umumiy yechimlar",
      footer: "totalSubmissions",
      accessorKey: "totalSubmissions",
    },
    {
      header: "Jarima",
      footer: "penalty",
      accessorKey: "penalty",
    },
    {
      header: "Umumiy tangalar",
      footer: "totalCoins",
      accessorKey: "totalCoins",
    },
  ];

  const contestIdRowCol: ColumnDef<any>[] = [
    {
      header: "holati",
      footer: "status",
      accessorKey: "status",
    },
    {
      header: "Boshlanish vaqti",
      footer: "startedDate",
      accessorKey: "startedDate",
    },
    {
      header: "Tugash vaqti",
      footer: "endDate",
      accessorKey: "endDate",
    },
    {
      header: "Davomiyligi",
      footer: "duration",
      accessorKey: "duration",
    },
    {
      header: "Masalalar soni",
      footer: "problemSets",
      accessorKey: "problemSets",
    },
    {
      header: "Qatnashuvchilar soni",
      footer: "participants",
      accessorKey: "participants",
    },
  ];
  const submissionRowCol: ColumnDef<any>[] = [
    {
      header: "Ishtirokchi",
      footer: "userFullName",
      accessorKey: "userFullName",
    },
    {
      header: "Masalalar",
      footer: "problemSetName",
      accessorKey: "problemSetName",
    },
    {
      header: "Til",
      footer: "language",
      accessorKey: "language",
    },
    {
      header: "Natija",
      footer: "result",
      accessorKey: "result",
    },
    {
      header: "Ijro vaqti",
      footer: "executionTime",
      accessorKey: "executionTime",
    },
    {
      header: "Yaratilgan vaqti",
      footer: "createdDate",
      accessorKey: "createdDate",
    },
  ];

  const contestProblemsetSubCol: ColumnDef<any>[] = [
    {
      header: "ID",
      footer: "id",
      accessorKey: "id",
    },
    {
      header: "Masala",
      footer: "problemSetName",
      accessorKey: "problemSetName",
    },
    {
      header: "Holati",
      footer: "result",
      accessorKey: "result",
    },
    {
      header: "Til",
      footer: "language",
      accessorKey: "language",
    },
    {
      header: "Sana",
      footer: "dateTime",
      accessorKey: "dateTime",
    },
  ];

  const generalProblemSetsRowCol: ColumnDef<any>[] = [
    {
      header: "ID",
      footer: "id",
      accessorKey: "id",
    },
    {
      header: "Nomi",
      footer: "name",
      accessorKey: "name",
    },
    {
      header: "Qiyinlik darajasi",
      footer: "difficulty",
      accessorKey: "difficulty",
      cell: ({ row }: any) => {
        const type = row.original?.type;

        if (type === "oson" || type === "Oson") {
          return (
            <span className="text-green-500">{row.original?.difficulty}%</span>
          );
        }
        if (
          type === "o'rta" ||
          type === "O'rta" ||
          type === "orta" ||
          type === "Orta" ||
          type === "o`rta" ||
          type === "O`rta"
        ) {
          return (
            <span className="text-yellow-500">{row.original?.difficulty}%</span>
          );
        }
        if (type === "qiyin" || type === "Qiyin") {
          return (
            <span className="text-red-500">{row.original?.difficulty}%</span>
          );
        }
        if (type === "Murakkab" || type === "murakkab") {
          return (
            <span className="text-purple-500">{row.original?.difficulty}%</span>
          );
        }
        return (
          <span className="text-gray-500">{row.original?.difficulty}%</span>
        );
      },
    },
    {
      header: "Toifasi",
      footer: "type",
      accessorKey: "type",
      cell: ({ row }: any) => {
        const type = row.original?.type;

        if (type === "oson" || type === "Oson") {
          return <span className="text-green-500">{type}</span>;
        }
        if (
          type === "o'rta" ||
          type === "O'rta" ||
          type === "orta" ||
          type === "Orta" ||
          type === "o`rta" ||
          type === "O`rta"
        ) {
          return <span className="text-yellow-500">{type}</span>;
        }
        if (type === "qiyin" || type === "Qiyin") {
          return <span className="text-red-500">{type}</span>;
        }
        if (type === "Murakkab" || type === "murakkab") {
          return <span className="text-purple-500">{type}</span>;
        }
        return <span className="text-gray-500">{type}</span>;
      },
    },
    {
      header: "Xotira joyi",
      footer: "memoryLimit",
      accessorKey: "memoryLimit",
      cell: ({ row }: any) => {
        return <span>{row.original?.memoryLimit}Kbs</span>;
      },
    },
  ];

  const generalProblemsetSubRowCol: ColumnDef<any>[] = [
    {
      header: "ID",
      footer: "id",
      accessorKey: "id",
    },
    {
      header: "Masala",
      footer: "problemSetName",
      accessorKey: "problemSetName",
    },
    {
      header: "Holati",
      footer: "result",
      accessorKey: "result",
    },
    {
      header: "Til",
      footer: "language",
      accessorKey: "language",
    },
    {
      header: "Sana",
      footer: "createdDate",
      accessorKey: "createdDate",
    },
    {
      header: "Ijro vaqti",
      footer: "executionTime",
      accessorKey: "executionTime",
    },
    {
      header: "Xotiradagi joyi",
      footer: "usageMemory",
      accessorKey: "usageMemory",
    },
  ];

  return {
    contestRowCol,
    usersRowCol,
    participantsRowCol,
    problemSetRowCol,
    standingsRowCol,
    contestIdRowCol,
    submissionRowCol,
    contestProblemsetSubCol,
    generalProblemSetsRowCol,
    generalProblemsetSubRowCol,
  };
}
