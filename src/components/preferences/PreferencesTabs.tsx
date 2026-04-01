"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeySection from "@/components/settings/ApiKeySection";

const AudioSettings = dynamic(
  () => import("@/components/preferences/AudioSettings"),
  { ssr: false }
);

interface PreferencesTabsProps {
  hasCustomKey: boolean;
  currentModel: string;
}

export default function PreferencesTabs({
  hasCustomKey,
  currentModel,
}: PreferencesTabsProps) {
  return (
    <Tabs defaultValue="audio">
      <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="audio"
          className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-base font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          음성 및 마이크
        </TabsTrigger>
        <TabsTrigger
          value="apikey"
          className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-base font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          API Key
        </TabsTrigger>
      </TabsList>

      <TabsContent value="audio" className="mt-6">
        <AudioSettings />
      </TabsContent>

      <TabsContent value="apikey" className="mt-6">
        <ApiKeySection hasCustomKey={hasCustomKey} currentModel={currentModel} />
      </TabsContent>
    </Tabs>
  );
}
