"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

function getSegments(pathname: string, userName: string): BreadcrumbSegment[] {
  const ROOT: BreadcrumbSegment = { label: userName, href: "/resume" };

  if (pathname.startsWith("/profile")) {
    return [ROOT, { label: "내 소개" }];
  }
  if (pathname.startsWith("/resume")) {
    return [ROOT, { label: "문서 관리" }];
  }
  if (pathname.startsWith("/report/")) {
    return [ROOT, { label: "모의 인터뷰", href: "/interview" }, { label: "리포트" }];
  }
  if (pathname.startsWith("/interview/")) {
    return [ROOT, { label: "모의 인터뷰", href: "/interview" }, { label: "면접 진행 중" }];
  }
  if (pathname.startsWith("/interview")) {
    return [ROOT, { label: "모의 인터뷰" }];
  }
  if (pathname.startsWith("/setup")) {
    return [ROOT, { label: "모의 인터뷰", href: "/interview" }, { label: "면접 설정" }];
  }
  if (pathname.startsWith("/settings")) {
    return [ROOT, { label: "계정 설정" }];
  }
  return [];
}

interface AppBreadcrumbProps {
  userName: string;
}

export default function AppBreadcrumb({ userName }: AppBreadcrumbProps) {
  const pathname = usePathname();
  const segments = getSegments(pathname, userName);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={segment.label}>
              <BreadcrumbItem className={!isLast ? "hidden md:block" : undefined}>
                {!isLast && segment.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={segment.href}>{segment.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
