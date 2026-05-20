import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Music, X } from "lucide-react";
import {
  Button,
  SearchField,
  Select,
  EmptyState,
  Badge,
  cx,
} from "../ui";
import RequestRow from "./RequestRow";

function parseArtist(title) {
  const idx = title.indexOf(" - ");
  return idx > 0 ? title.substring(0, idx).trim() : null;
}

export default function LibraryView({
  requests,
  userRole,
  sessionId,
  onDelete,
  onRetry,
  onShowUploadGuide,
}) {
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterProfile, setFilterProfile] = useState("all");
  const [filterArtist, setFilterArtist] = useState("all");
  const [groupByArtist, setGroupByArtist] = useState(false);

  const artists = useMemo(() => {
    const set = new Set();
    requests.forEach((r) => {
      const a = parseArtist(r.title);
      if (a) set.add(a);
    });
    return [...set].sort();
  }, [requests]);

  const downloadCounts = useMemo(() => {
    const counts = {};
    requests.forEach((r) => {
      if (r.status === "completed") {
        const k = r.title.toLowerCase();
        counts[k] = (counts[k] || 0) + 1;
      }
    });
    return counts;
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterType !== "all" && r.type !== filterType) return false;
      if (filterProfile !== "all" && r.profile !== filterProfile) return false;
      if (filterArtist !== "all" && parseArtist(r.title) !== filterArtist) return false;
      if (searchQ && !r.title.toLowerCase().includes(searchQ.toLowerCase())) return false;
      return true;
    });
  }, [requests, filterStatus, filterType, filterProfile, filterArtist, searchQ]);

  const hasActiveFilter =
    searchQ ||
    filterStatus !== "all" ||
    filterType !== "all" ||
    filterProfile !== "all" ||
    filterArtist !== "all";

  const clearFilters = () => {
    setSearchQ("");
    setFilterStatus("all");
    setFilterType("all");
    setFilterProfile("all");
    setFilterArtist("all");
  };

  const grouped = useMemo(() => {
    if (!groupByArtist) return null;
    const map = {};
    filtered.forEach((r) => {
      const a = parseArtist(r.title) || "Unknown artist";
      (map[a] = map[a] || []).push(r);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupByArtist]);

  return (
    <div className="space-y-4">
      {/* Toolbar — labeled & compact */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <SearchField
            value={searchQ}
            onChange={setSearchQ}
            placeholder="Search titles or artists…"
          />
          <Button
            variant={groupByArtist ? "primary" : "secondary"}
            onClick={() => setGroupByArtist((v) => !v)}
          >
            Group by artist
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "all", label: "All" },
              { value: "completed", label: "Ready" },
              { value: "downloading", label: "Downloading" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "failed", label: "Failed" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
          <FilterChip
            label="Type"
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: "all", label: "All" },
              { value: "music", label: "Music" },
              { value: "audiobook", label: "Audiobook" },
            ]}
          />
          {userRole === "parent" && (
            <FilterChip
              label="Profile"
              value={filterProfile}
              onChange={setFilterProfile}
              options={[
                { value: "all", label: "All" },
                { value: "yoto", label: "Yoto" },
                { value: "ipod", label: "iPod" },
              ]}
            />
          )}
          {artists.length > 0 && (
            <FilterChip
              label="Artist"
              value={filterArtist}
              onChange={setFilterArtist}
              options={[
                { value: "all", label: "All" },
                ...artists.map((a) => ({ value: a, label: a })),
              ]}
            />
          )}
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--danger)] px-2 py-1"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
          {hasActiveFilter && (
            <span className="ml-auto text-xs text-[var(--text-muted)] tabular-nums">
              {filtered.length} of {requests.length}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Music className="w-5 h-5" />}
          title={
            requests.length === 0 ? "No requests yet" : "Nothing matches those filters"
          }
          description={
            requests.length === 0
              ? userRole === "child"
                ? "Head to the Request page to send your first one."
                : "Approved and historical requests show up here."
              : "Try clearing a filter or searching differently."
          }
          action={
            hasActiveFilter && (
              <Button size="sm" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            )
          }
        />
      ) : grouped ? (
        <div className="space-y-3">
          {grouped.map(([artist, items]) => (
            <ArtistGroup
              key={artist}
              artist={artist}
              items={items}
              downloadCounts={downloadCounts}
              userRole={userRole}
              sessionId={sessionId}
              onDelete={onDelete}
              onRetry={onRetry}
              onShowUploadGuide={onShowUploadGuide}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {filtered.map((r) => (
              <RequestRow
                key={r.id}
                request={r}
                downloadCount={downloadCounts[r.title.toLowerCase()] || 0}
                userRole={userRole}
                sessionId={sessionId}
                onDelete={onDelete}
                onRetry={onRetry}
                onShowUploadGuide={onShowUploadGuide}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, value, onChange, options }) {
  const active = value !== "all";
  return (
    <div className="inline-flex items-center gap-1.5 text-xs">
      <span className={cx("font-medium", active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
        {label}
      </span>
      <Select size="sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

function ArtistGroup({ artist, items, downloadCounts, userRole, sessionId, onDelete, onRetry, onShowUploadGuide }) {
  const [open, setOpen] = useState(true);
  const ready = items.filter((r) => r.status === "completed").length;

  return (
    <div className="border border-[var(--border-subtle)] rounded-[var(--r-lg)] overflow-hidden bg-[var(--surface)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-[var(--surface-2)] hover:bg-[var(--border-subtle)] transition-colors text-left"
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
        )}
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {artist}
        </span>
        <Badge tone="neutral" size="xs">
          {items.length} track{items.length !== 1 ? "s" : ""}
          {ready > 0 ? ` · ${ready} ready` : ""}
        </Badge>
      </button>
      {open && (
        <div className="p-2 space-y-2">
          {items.map((r) => (
            <RequestRow
              key={r.id}
              request={r}
              downloadCount={downloadCounts[r.title.toLowerCase()] || 0}
              userRole={userRole}
              sessionId={sessionId}
              onDelete={onDelete}
              onRetry={onRetry}
              onShowUploadGuide={onShowUploadGuide}
            />
          ))}
        </div>
      )}
    </div>
  );
}
