import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPlayerByUsername } from "@/lib/services/player-service";
import { RoleChip } from "@/components/role-chip";
import { QrCode, ShieldCheck, ArrowLeft, Trophy, Award, MapPin } from "lucide-react";
import { PrintResumeButton } from "@/components/print-resume-button";

interface ResumePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ResumePageProps): Promise<Metadata> {
  const { username } = await params;
  const player = await getPlayerByUsername(username);

  if (!player) return { title: "Player Resume Not Found" };

  return {
    title: `${player.displayName} - Pickleball Player Resume & Credentials`,
    description: `Official tournament record and verified pickleball credentials for ${player.displayName}.`,
  };
}

export default async function PlayerResumePage({ params }: ResumePageProps) {
  const { username } = await params;
  const player = await getPlayerByUsername(username);

  if (!player) notFound();

  const primaryRole = player.roles?.find((r) => r.isPrimary);
  const secondaryRoles = player.roles?.filter((r) => !r.isPrimary) || [];
  const achievements = player.achievements || [];
  const endorsements = player.endorsements || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      {/* Top action bar (hidden when printing) */}
      <div className="flex items-center justify-between gap-4 mb-8 print:hidden">
        <Link
          href={`/p/${player.username}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to player passport</span>
        </Link>

        <PrintResumeButton />
      </div>

      {/* Official Printable Resume Sheet */}
      <div className="bg-white text-neutral-900 p-8 sm:p-12 rounded-[28px] border border-neutral-200 shadow-lg print:shadow-none print:border-none print:p-0 print:rounded-none">
        {/* Resume Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b-2 border-neutral-900">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 border-2 border-neutral-300 flex-shrink-0">
              {player.avatarUrl ? (
                <Image src={player.avatarUrl} alt={player.displayName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-neutral-400">
                  {player.displayName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
                  {player.displayName}
                </h1>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs font-mono text-neutral-600">
                @{player.username} · {primaryRole?.role.label || "Pickleball Athlete"}
              </p>
              {(player.city || player.country) && (
                <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>
                    {player.city}
                    {player.city && player.country ? ", " : ""}
                    {player.country}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* QR Code & Skill Ring */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Rating
              </span>
              <span className="text-2xl font-black text-neutral-950">
                {player.skillLevel?.toFixed(1) || "3.5"}
              </span>
            </div>

            <div className="w-16 h-16 border-2 border-neutral-900 rounded-xl p-1 flex items-center justify-center" title="Profile QR Link">
              <QrCode className="w-12 h-12 text-neutral-900" />
            </div>
          </div>
        </div>

        {/* Bio Statement */}
        {player.bio && (
          <div className="py-6 border-b border-neutral-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">
              Player Summary
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {player.bio}
            </p>
          </div>
        )}

        {/* Athlete Specification Matrix */}
        <div className="py-6 border-b border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-neutral-500 block uppercase font-bold text-[10px]">Dominant Hand</span>
            <span className="font-bold text-neutral-900 capitalize">{player.dominantHand || "Right"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block uppercase font-bold text-[10px]">Experience</span>
            <span className="font-bold text-neutral-900">{player.yearsPlaying || 1} Years Active</span>
          </div>
          <div>
            <span className="text-neutral-500 block uppercase font-bold text-[10px]">Paddle Spec</span>
            <span className="font-bold text-neutral-900 truncate block">{player.paddleBrand || "Not listed"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block uppercase font-bold text-[10px]">Home Club</span>
            <span className="font-bold text-neutral-900 truncate block">{player.homeClub || "Independent"}</span>
          </div>
        </div>

        {/* Playing Roles */}
        <div className="py-6 border-b border-neutral-200">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2.5">
            Declared Court Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {primaryRole && <RoleChip role={primaryRole.role} isPrimary size="md" />}
            {secondaryRoles.map((sr) => (
              <RoleChip key={sr.roleId} role={sr.role} size="md" />
            ))}
          </div>
        </div>

        {/* Verified Tournament Achievements */}
        <div className="py-6 border-b border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Tournament Podiums &amp; Milestone Records ({achievements.length})</span>
            </h3>
          </div>

          {achievements.length > 0 ? (
            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-neutral-200">
                <thead className="bg-neutral-50 font-bold uppercase text-[10px] text-neutral-500">
                  <tr>
                    <th className="p-2.5">Placement</th>
                    <th className="p-2.5">Event / Division</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Partner</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {achievements.map((ach) => (
                    <tr key={ach.id}>
                      <td className="p-2.5 font-black text-neutral-900">{ach.placement || ach.title}</td>
                      <td className="p-2.5 font-medium">{ach.eventName || ach.title} {ach.division ? `(${ach.division})` : ""}</td>
                      <td className="p-2.5 text-neutral-600 font-mono">{ach.eventDate || "Archived"}</td>
                      <td className="p-2.5 text-neutral-600">{ach.partnerName || "—"}</td>
                      <td className="p-2.5 font-bold capitalize text-emerald-700">{ach.status.replace("_", " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">No tournament results logged.</p>
          )}
        </div>

        {/* Peer Endorsements Summary */}
        <div className="pt-6 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Peer Player Endorsements ({endorsements.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {endorsements.map((end) => (
              <div key={end.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block">{end.fromProfile?.displayName || "Peer Player"}</span>
                <span className="text-emerald-700 font-semibold text-[11px] block">{end.targetValue}</span>
                {end.note && <p className="text-neutral-600 mt-1 italic">&ldquo;{end.note}&rdquo;</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Resume Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span>Verified via PaddleUp Player Registry</span>
          <span>paddleup.app/p/{player.username}</span>
        </div>
      </div>
    </div>
  );
}
