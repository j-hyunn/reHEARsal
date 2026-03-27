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

const ROOT: BreadcrumbSegment = { label: "reHEARsal", href: "/resume" };

function getSegments(pathname: string): BreadcrumbSegment[] {
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

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = getSegments(pathname);

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
                  <BreadcrumbLink render={<Link href={segment.href} />}>
                    {segment.label}
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
