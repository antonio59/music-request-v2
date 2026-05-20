import { motion } from "framer-motion";
import {
  BookOpen,
  Radio,
  Headphones,
  Music,
  Link as LinkIcon,
  Search,
  Upload,
  Tag,
  Layers,
  ListMusic,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Card, SectionHeader, Button, Badge, cx } from "../components/ui";

function StepList({ items, accent = "var(--brand)" }) {
  return (
    <ol className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span
            aria-hidden
            className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-semibold mt-0.5"
            style={{
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
            }}
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            {typeof it === "string" ? (
              <p className="text-sm text-[var(--text-secondary)] leading-snug">{it}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                  {it.title}
                </p>
                {it.desc && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {it.desc}
                  </p>
                )}
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Callout({ icon: Icon = AlertCircle, tone = "info", children }) {
  const toneCls = {
    info: "bg-[var(--info-soft)] border-[var(--info-border)] text-[var(--text-secondary)]",
    warning: "bg-[var(--warning-soft)] border-[var(--warning-border)] text-[var(--text-secondary)]",
    brand: "bg-[var(--brand-soft)] border-[var(--brand-soft-strong)] text-[var(--text-secondary)]",
  }[tone];
  const iconColor = {
    info: "var(--info)",
    warning: "var(--warning)",
    brand: "var(--brand)",
  }[tone];

  return (
    <div className={cx("flex items-start gap-2.5 p-3 mt-4 border rounded-[var(--r-md)]", toneCls)}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: iconColor }} />
      <p className="text-sm leading-snug">{children}</p>
    </div>
  );
}

export default function Tutorial() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            How JamJar works
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xl">
            Request songs and audiobooks for your Yoto card or iPod. Here's the
            end-to-end flow plus device-specific upload guides.
          </p>
        </motion.div>
      </header>

      {/* Quick start */}
      <Card padding="md">
        <SectionHeader
          title="Quick start"
          description="Three steps that work for every request type."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "1. Request", body: "Pick a device (parents), choose music or audiobook, find your content." },
            { icon: ListMusic, title: "2. Review", body: "Parents approve or reject from the Triage tab on the dashboard." },
            { icon: Upload, title: "3. Listen", body: "Music auto-downloads; audiobooks need a manual upload to the device." },
          ].map((s) => (
            <div key={s.title} className="flex flex-col items-start gap-2 p-3 bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
              <s.icon className="w-5 h-5 text-[var(--brand)]" />
              <p className="font-semibold text-[var(--text-primary)] text-sm">{s.title}</p>
              <p className="text-xs text-[var(--text-muted)] leading-snug">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button as={RouterLink} to="/" variant="primary" iconLeft={<Sparkles className="w-4 h-4" />}>
            Start a new request
          </Button>
        </div>
      </Card>

      {/* Music */}
      <Card padding="md">
        <SectionHeader
          title="Requesting music"
          description="Two ways to find a track — search or paste."
          action={<Badge tone="brand" size="sm"><Music className="w-3 h-3" /> Auto-downloads</Badge>}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
            <div className="flex items-center gap-2 mb-3 text-[var(--brand)]">
              <Search className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Option 1 — Search</h3>
            </div>
            <StepList
              items={[
                "Open Request and choose Music",
                'Keep the "Search" mode selected',
                "Type artist + song for the best match",
                "Tap the result you want",
                "Continue, review, send",
              ]}
            />
          </div>
          <div className="p-4 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
            <div className="flex items-center gap-2 mb-3 text-[var(--brand)]">
              <LinkIcon className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Option 2 — Paste YouTube link</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              Use when search misses the exact version you want.
            </p>
            <StepList
              items={[
                "Find the video on YouTube and copy the URL",
                'In Request, switch to "Paste YouTube link"',
                "Paste — JamJar will preview the video",
                "Edit the title so the library entry is clean",
                "Continue, review, send",
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Audiobooks */}
      <Card padding="md">
        <SectionHeader
          title="Requesting audiobooks"
          description="Audiobooks are sourced and uploaded by a parent — JamJar tracks them so nothing slips through."
          action={<Badge tone="info" size="sm"><BookOpen className="w-3 h-3" /> Manual upload</Badge>}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">For kids</h3>
            <StepList
              items={[
                { title: "Choose Audiobook", desc: "On the Request page, second step." },
                { title: "Search a title or author", desc: "Powered by Open Library — pick the closest match." },
                { title: "Send the request", desc: "It lands in a grown-up's queue." },
              ]}
              accent="var(--info)"
            />
          </div>
          <div className="p-4 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">For parents</h3>
            <StepList
              items={[
                { title: "Approve in Triage", desc: "Acknowledges the request — no auto-download." },
                { title: "Open Needs Upload tab", desc: "Use the “How to upload” drawer for step-by-step." },
                { title: "Source the audiobook", desc: "Audible, Librivox, library rip — your choice." },
                { title: "Mark uploaded", desc: "Removes it from the upload list once done." },
              ]}
              accent="var(--info)"
            />
          </div>
        </div>
      </Card>

      {/* Yoto */}
      <Card padding="md" className="border-[var(--warning-border)]">
        <SectionHeader
          title="Yoto Player upload guide"
          description="How to get a finished MP3 onto your Yoto card."
          action={<Badge tone="warning" size="sm"><Radio className="w-3 h-3" /> Yoto</Badge>}
        />
        <StepList
          items={[
            { title: "Wait for the download", desc: "Music downloads automatically once a parent approves." },
            { title: "Preview the file", desc: "Use the Preview button in the dashboard to make sure the track is right." },
            { title: "Download the MP3", desc: "Tap Download in the row — saves to your computer." },
            { title: "Open Yoto Studio or the app", desc: "my.yotoplay.com (computer) or the Yoto app (phone/tablet)." },
            { title: "Add audio to a blank card", desc: "Make Your Own → Add Audio → upload the MP3 → Save." },
            { title: "Insert the card", desc: "Put it in the player and it plays straight away." },
          ]}
          accent="var(--warning)"
        />

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 border border-[var(--border-subtle)] rounded-[var(--r-lg)] bg-[var(--surface-2)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">📱 Yoto app</p>
            <p className="text-xs text-[var(--text-muted)] leading-snug">
              Open the app → Make Your Own → choose your blank card → Add Audio → pick the MP3 → Save.
            </p>
          </div>
          <div className="p-4 border border-[var(--border-subtle)] rounded-[var(--r-lg)] bg-[var(--surface-2)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">💻 Yoto website</p>
            <p className="text-xs text-[var(--text-muted)] leading-snug">
              Plug the player into your computer via USB, then visit{" "}
              <a
                href="https://uk.yotoplay.com/make-your-own"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand)] hover:underline inline-flex items-center gap-0.5"
              >
                yotoplay.com/make-your-own <ExternalLink className="w-3 h-3" />
              </a>
              {" "}and follow the same flow.
            </p>
          </div>
        </div>

        <Callout tone="warning">
          <strong>Plug in first.</strong> The website method needs the Yoto Player connected via USB before you visit the site.
        </Callout>

        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)]">
            <Tag className="w-3.5 h-3.5" />
            <p className="text-xs font-semibold uppercase tracking-wide">Naming tips</p>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-snug">
            In the Yoto app, tap any card → <strong>Edit</strong> to change its name, description, and image. A name like{" "}
            <em>"Bedtime — 5 Songs"</em> tells you exactly what's on the card without playing it.
          </p>
        </div>
      </Card>

      {/* iPod */}
      <Card padding="md" className="border-[var(--info-border)]">
        <SectionHeader
          title="iPod upload guide"
          description="Sync a downloaded MP3 to a classic iPod."
          action={<Badge tone="info" size="sm"><Headphones className="w-3 h-3" /> iPod</Badge>}
        />
        <StepList
          items={[
            { title: "Download the MP3", desc: "Tap Download in the dashboard once the track is ready." },
            { title: "Connect the iPod", desc: "Use a Lightning/30-pin cable. Trust the device when prompted." },
            { title: "Open Apple Music or Finder", desc: "macOS uses Finder for iPod sync; older Windows uses iTunes." },
            { title: "Drag the file in", desc: "Drop the MP3 into the iPod's music library, or use Sync Music." },
            { title: "Wait for sync to finish", desc: "Don't unplug until the sync indicator stops." },
          ]}
          accent="var(--info)"
        />
        <Callout tone="info">
          For audiobooks, drop the file into <strong>Books → Audiobooks</strong> instead of Music — the iPod tracks bookmarks differently there.
        </Callout>
      </Card>

      {/* Library tips */}
      <Card padding="md">
        <SectionHeader
          title="Library tips"
          description="Keep your dashboard tidy as it grows."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
            <Layers className="w-4 h-4 text-[var(--brand)] mb-2" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">Group by artist</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              The Library tab has a "Group by artist" toggle — handy when a single artist dominates.
            </p>
          </div>
          <div className="p-3 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
            <Search className="w-4 h-4 text-[var(--brand)] mb-2" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">Use filters</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Filter by status, type, profile, or artist. Multiple filters stack.
            </p>
          </div>
          <div className="p-3 border border-[var(--border-subtle)] rounded-[var(--r-lg)]">
            <AlertCircle className="w-4 h-4 text-[var(--brand)] mb-2" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">Fix broken downloads</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              The Maintenance tab lists failed downloads and offers a one-tap retry.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
