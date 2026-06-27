// Colors — now using Discord's CSS variables for theme compatibility
export const bg = "var(--background-surface-high)";
const menuBg = "var(--background-base-lower)";
const primaryText = "var(--input-text-default)";
const mutedText = "var(--text-muted)";
const danger = "var(--text-feedback-critical)";
const brand = "var(--background-brand)";

// Injected CSS
export const globalCss = `
  .gss-input::placeholder { color: ${mutedText}; }
  .gss-scroll::-webkit-scrollbar { display: none; }
  .gss-scroll { scrollbar-width: none; -ms-overflow-style: none; }
`;

// Styles
export const styles = {
  // wrapContent
  contentWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    height: "100%"
  },

  // FolderBar
  folderBar: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    padding: "6px 8px",
    flexShrink: 0,
    background: bg
  },

  tabScrollArea: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: "6px",
    overflowX: "auto" as const,
    flex: 1,
    minWidth: 0
  },

  tabButton: (active: boolean) => ({
    background: active ? brand : menuBg,
    borderRadius: "6px",
    color: primaryText,
    cursor: "pointer" as const,
    fontSize: "14px",
    fontWeight: active ? "600" : "normal",
    padding: "5px 12px",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
    height: "30px",
    border: "none"
  }),

  tabInput: {
    background: menuBg,
    borderRadius: "6px",
    color: primaryText,
    fontSize: "14px",
    padding: "5px 8px",
    width: "120px",
    outline: "none",
    flexShrink: 0,
    border: "none"
  },

  barDivider: {
    width: "1px",
    height: "20px",
    background: mutedText,
    margin: "0 8px",
    flexShrink: 0
  },

  actionGroup: {
    display: "flex",
    gap: "4px",
    flexShrink: 0
  },

  actionButton: (variant: "default" | "danger" = "default") => ({
    background: variant === "danger" ? danger : menuBg,
    borderRadius: "6px",
    color: variant === "danger" ? "#ffffff" : primaryText,
    cursor: "pointer" as const,
    fontSize: "18px",
    fontWeight: "bold",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: "0",
    lineHeight: "1",
    border: "none"
  }),

  // GifOverlay
  overlayHitArea: {
    position: "absolute" as const,
    inset: 0,
    zIndex: 1
  },

  overlayTrigger: {
    position: "absolute" as const,
    bottom: "6px",
    left: "6px",
    background: menuBg,
    borderRadius: "4px",
    cursor: "pointer",
    padding: "2px 7px",
    zIndex: 2,
    color: primaryText,
    fontSize: "18px",
    fontWeight: "bold",
    lineHeight: 1,
    boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
    border: "none"
  },

  overlayDropdown: {
    position: "absolute" as const,
    top: "6px",
    right: "6px",
    background: menuBg,
    borderRadius: "8px",
    padding: "4px",
    zIndex: 3,
    display: "flex",
    flexDirection: "column" as const,
    minWidth: "140px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.6)"
  },

  overlayEmptyText: {
    color: mutedText,
    padding: "6px 8px",
    fontSize: "14px"
  },

  overlayFolderItem: {
    padding: "6px 8px",
    borderRadius: "4px",
    cursor: "pointer" as const,
    color: primaryText,
    fontSize: "14px"
  },

  overlayDivider: {
    height: "1px",
    background: mutedText,
    margin: "4px 0"
  },

  overlayRemoveItem: {
    padding: "6px 8px",
    borderRadius: "4px",
    cursor: "pointer" as const,
    color: danger,
    fontSize: "14px"
  }
};
