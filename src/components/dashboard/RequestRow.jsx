import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Music,
  BookOpen,
  Trash2,
  RotateCcw,
  Download,
  Play,
  Pause,
  UploadCloud,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import useStore from "../../store/useStore";
import { Badge, StatusBadge, Button, IconButton, cx } from "../ui";

function profileMeta(profile) {
  if (profile === "yoto") return { tone: "yoto", label: "Yoto", emoji: "📻" };
  if (profile === "ipod") return { tone: "ipod", label: "iPod", emoji: "🎧" };
  return { tone: "neutral", label: profile, emoji: "👤" };
}

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

function looksGeneric(title) {
  if (!title) return true;
  const lower = title.toLowerCase().trim();
  return (
    lower === "video from url" ||
    lower === "youtube video" ||
    lower === "song" ||
    lower.startsWith("untitled")
  );
}

export default function RequestRow({
  request,
  downloadCount = 0,
  userRole,
  sessionId,
  selectable = false,
  selected = false,
  onToggleSelect,
  onDelete,
  onApprove,
  onReject,
  onRetry,
  onMarkUploaded,
  onShowUploadGuide,
}) {
  const profile = profileMeta(request.profile);
  const isDuplicate = downloadCount > 1 && request.status === "completed";
  const isGenericTitle = looksGeneric(request.title);
  const [busy, setBusy] = useState(null);

  const run = (key, fn) => async (...args) => {
    setBusy(key);
    try {
      await fn(...args);
    } finally {
      setBusy(null);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={cx(
        "group bg-[var(--surface)] border rounded-[var(--r-lg)] p-3 sm:p-4 transition-colors",
        selected
          ? "border-[var(--brand)] ring-1 ring-[var(--brand)]"
          : "border-[var(--border-subtle)] hover:border-[var(--border-default)]",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Optional bulk-select checkbox */}
        {selectable && (
          <label className="flex items-center pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect?.(request.id)}
              className="w-4 h-4 rounded border-[var(--border-default)] text-[var(--brand)] focus:ring-[var(--brand)]"
            />
          </label>
        )}

        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {request.thumbnail ? (
            <img
              src={request.thumbnail}
              alt=""
              className="w-12 h-12 rounded-[var(--r-md)] object-cover bg-[var(--surface-2)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-[var(--r-md)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)]">
              {request.type === "audiobook" ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <Music className="w-5 h-5" />
              )}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 min-w-0">
              {request.title || "Untitled"}
              {isGenericTitle && userRole === "parent" && (
                <span
                  className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-normal text-[var(--warning)] align-middle"
                  title="Generic title — consider renaming for clearer library + analytics"
                >
                  <AlertTriangle className="w-3 h-3" />
                  generic
                </span>
              )}
            </h3>
            {userRole === "parent" &&
              ["rejected", "completed", "failed"].includes(request.status) && (
                <IconButton
                  size="xs"
                  variant="ghost"
                  label="Delete"
                  onClick={() => onDelete?.(request.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--danger)]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </IconButton>
              )}
          </div>

          {/* Meta row — compact badges */}
          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
            <StatusBadge status={request.status} />
            <Badge tone={profile.tone} size="xs">
              <span aria-hidden>{profile.emoji}</span> {profile.label}
            </Badge>
            <Badge tone={request.type === "audiobook" ? "info" : "neutral"} size="xs">
              {request.type === "audiobook" ? "Audiobook" : "Music"}
            </Badge>
            <span className="text-[11px] text-[var(--text-muted)]">
              {formatDate(request.created_at)}
            </span>
            {isDuplicate && (
              <Badge tone="warning" size="xs" icon={<AlertTriangle className="w-3 h-3" />}>
                {downloadCount}× downloaded
              </Badge>
            )}
          </div>

          {/* Error message */}
          {request.status === "failed" && request.error_message && (
            <p className="text-xs text-[var(--danger)] mt-2 line-clamp-2">
              {request.error_message}
            </p>
          )}

          {/* Audio preview — only when ready and has playable URL */}
          {request.status === "completed" && request.internxt_url && (
            <MiniPlayer request={request} sessionId={sessionId} className="mt-3" />
          )}

          {/* Action groups — grouped by intent, never mixed */}
          <RowActions
            request={request}
            userRole={userRole}
            busy={busy}
            onApprove={run("approve", onApprove)}
            onReject={run("reject", onReject)}
            onRetry={run("retry", onRetry)}
            onMarkUploaded={run("uploaded", onMarkUploaded)}
            onShowUploadGuide={onShowUploadGuide}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Row Actions — strict grouping ──────────────────────────────────────────
   Three lanes, visually separated, never mixed:
   1. Decisions  (approve / reject)    — primary intent
   2. Library    (preview / download)  — non-destructive use
   3. Recovery   (retry / mark uploaded)  — fix-it actions
   Destructive (delete) lives in the title row only.                          */
function RowActions({
  request,
  userRole,
  busy,
  onApprove,
  onReject,
  onRetry,
  onMarkUploaded,
  onShowUploadGuide,
}) {
  const isParent = userRole === "parent";
  const lanes = [];

  // Decisions — pending only
  if (isParent && request.status === "pending") {
    lanes.push(
      <div key="decisions" className="flex items-center gap-2">
        <Button
          size="sm"
          variant="success"
          loading={busy === "approve"}
          onClick={() => onApprove(request.id)}
          iconLeft={<Check className="w-4 h-4" />}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="secondary"
          loading={busy === "reject"}
          onClick={() => onReject(request.id, "Not appropriate")}
          iconLeft={<X className="w-4 h-4" />}
        >
          Reject
        </Button>
      </div>,
    );
  }

  // Audiobook upload — approved audiobooks waiting on manual upload
  if (isParent && request.type === "audiobook" && request.status === "approved") {
    lanes.push(
      <div key="upload" className="flex items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          loading={busy === "uploaded"}
          onClick={() => onMarkUploaded(request.id)}
          iconLeft={<UploadCloud className="w-4 h-4" />}
        >
          Mark uploaded
        </Button>
        {onShowUploadGuide && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onShowUploadGuide(request)}
            iconLeft={<HelpCircle className="w-4 h-4" />}
          >
            How to upload
          </Button>
        )}
      </div>,
    );
  }

  // Library — download is primary on ready music; re-download is recovery
  if (request.status === "completed" && request.internxt_url) {
    lanes.push(
      <div key="library" className="flex items-center gap-2">
        <DownloadButton request={request} />
        {isParent && request.type === "music" && (
          <Button
            size="sm"
            variant="ghost"
            loading={busy === "retry"}
            onClick={() => onRetry(request.id, request.title)}
            iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-[var(--text-muted)]"
            title="Re-download (use if file is broken)"
          >
            Re-download
          </Button>
        )}
      </div>,
    );
  }

  // Recovery — retry failed music
  if (isParent && request.status === "failed" && request.type === "music") {
    lanes.push(
      <Button
        key="recovery"
        size="sm"
        variant="warning"
        loading={busy === "retry"}
        onClick={() => onRetry(request.id, request.title)}
        iconLeft={<RotateCcw className="w-4 h-4" />}
      >
        Retry download
      </Button>,
    );
  }

  if (lanes.length === 0) return null;
  return <div className="flex flex-wrap items-center gap-3 mt-3">{lanes}</div>;
}

/* ─── Mini Player — authenticated blob streaming ─────────────────────────── */
function MiniPlayer({ request, sessionId, className = "" }) {
  const [state, setState] = useState("idle"); // idle | loading | playing | paused | error
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const blobUrlRef = useRef(null);

  const streamUrl = request.internxt_url?.replace("/api/downloads/", "/api/stream/");

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const handleToggle = async () => {
    if (state === "loading") return;

    if (audioRef.current && blobUrlRef.current) {
      if (audioRef.current.paused) {
        await audioRef.current.play().catch(() => {});
        setState("playing");
      } else {
        audioRef.current.pause();
        setState("paused");
      }
      return;
    }

    setState("loading");
    setError(null);
    try {
      const res = await fetch(streamUrl, { headers: { "X-Session-Id": sessionId } });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403)
          throw new Error("Session expired — log in again");
        throw new Error(`Couldn't load preview (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
        await audioRef.current.play().catch(() => {});
      }
      setState("playing");
    } catch (e) {
      setError(e.message || "Preview unavailable");
      setState("error");
    }
  };

  return (
    <div className={cx("flex items-center gap-2", className)}>
      <Button
        size="xs"
        variant="secondary"
        onClick={handleToggle}
        loading={state === "loading"}
        iconLeft={
          state === "playing" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />
        }
      >
        {state === "playing" ? "Pause" : state === "paused" ? "Resume" : "Preview"}
      </Button>
      <audio
        ref={audioRef}
        controls
        onEnded={() => setState("paused")}
        onPause={() => state === "playing" && setState("paused")}
        onPlay={() => setState("playing")}
        className={cx(
          "h-8 transition-all",
          state === "idle" || state === "loading"
            ? "w-0 overflow-hidden opacity-0 pointer-events-none"
            : "w-full max-w-xs",
        )}
      />
      {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
    </div>
  );
}

/* ─── Download Button — authenticated blob → save ────────────────────────── */
function DownloadButton({ request }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const cleanTitle = request.title.replace(/[<>:"/\\|?*]/g, "").trim().substring(0, 80);
  const filename = cleanTitle ? `${cleanTitle}.mp3` : "song.mp3";

  const handleClick = async () => {
    setDownloading(true);
    setError(null);
    try {
      const { sessionId } = useStore.getState();
      const res = await fetch(request.internxt_url, {
        headers: { "X-Session-Id": sessionId },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="primary"
        loading={downloading}
        onClick={handleClick}
        iconLeft={<Download className="w-3.5 h-3.5" />}
      >
        Download
      </Button>
      {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
    </div>
  );
}
