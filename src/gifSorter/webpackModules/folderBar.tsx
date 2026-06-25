import React from "@moonlight-mod/wp/react";
import * as storageModule from "@moonlight-mod/wp/gifSorter_storage";

function FolderBar({ gifPickerThis }: { gifPickerThis: any }) {
  const storage = storageModule.getStorage();
  const [creating, setCreating] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [renaming, setRenaming] = React.useState(false);
  const [renameName, setRenameName] = React.useState("");

  const selectedFolder = storage.selectedFolder;
  const isFolderSelected = selectedFolder !== "all";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
        padding: "4px 8px",
        overflowX: "auto",
        flexShrink: 0,
        background: "var(--background-secondary)"
      }}
    >
      <button
        onClick={() => {
          storageModule.setSelectedFolder("all");
          gifPickerThis.forceUpdate();
        }}
      >
        All
      </button>
      {storage.folderOrder.map((id: string) => (
        <button
          key={id}
          onClick={() => {
            storageModule.setSelectedFolder(id);
            gifPickerThis.forceUpdate();
          }}
        >
          {storage.folders[id].name}
        </button>
      ))}

      {creating && (
        <input
          autoFocus
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newFolderName.trim().length > 0) {
              storageModule.createFolder(newFolderName.trim());
              setNewFolderName("");
              setCreating(false);
              gifPickerThis.forceUpdate();
            }
            if (e.key === "Escape") {
              setNewFolderName("");
              setCreating(false);
            }
          }}
          placeholder="Folder name..."
          style={{ width: "100px" }}
        />
      )}

      {renaming && isFolderSelected && (
        <input
          autoFocus
          value={renameName}
          onChange={(e) => setRenameName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && renameName.trim().length > 0) {
              storageModule.renameFolder(selectedFolder, renameName.trim());
              setRenameName("");
              setRenaming(false);
              gifPickerThis.forceUpdate();
            }
            if (e.key === "Escape") {
              setRenameName("");
              setRenaming(false);
            }
          }}
          placeholder="New name..."
          style={{ width: "100px" }}
        />
      )}

      <div style={{ marginLeft: "auto", display: "flex", gap: "4px", flexShrink: 0 }}>
        {!creating && (
          <button
            onClick={() => {
              setRenaming(false);
              setCreating(true);
            }}
          >
            +
          </button>
        )}
        {isFolderSelected && !renaming && (
          <button
            onClick={() => {
              setRenameName(storage.folders[selectedFolder].name);
              setCreating(false);
              setRenaming(true);
            }}
          >
            ✏️
          </button>
        )}
        {isFolderSelected && (
          <button
            onClick={() => {
              storageModule.deleteFolder(selectedFolder);
              gifPickerThis.forceUpdate();
            }}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

export function wrapContent(gifPickerThis: any, component: any) {
  const isFavorites = gifPickerThis.state.resultType === "Favorites";

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      {isFavorites && <FolderBar gifPickerThis={gifPickerThis} />}
      {component}
    </div>
  );
}

function GifOverlay({ item }: { item: any }) {
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const storage = storageModule.getStorage();
  const selectedFolder = storage.selectedFolder;
  const isInCurrentFolder = selectedFolder !== "all" && storage.folders[selectedFolder]?.gifs.includes(item.url);

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          if (!open) setHovered(false);
        }}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />
      {(hovered || open) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            if (!open) setHovered(false);
          }}
          style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            background: "#2b2d31",
            border: "1px solid #1e1f22",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "2px 7px",
            zIndex: 2,
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            lineHeight: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          +
        </div>
      )}
      {open && (
        <div
          onMouseLeave={() => {
            setHovered(false);
            setOpen(false);
          }}
          style={{
            position: "absolute",
            bottom: "36px",
            right: "6px",
            background: "#2b2d31",
            border: "1px solid #1e1f22",
            borderRadius: "8px",
            padding: "4px",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            minWidth: "140px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.6)"
          }}
        >
          {storage.folderOrder.length === 0 && (
            <div style={{ color: "#949ba4", padding: "6px 8px", fontSize: "14px" }}>No folders yet</div>
          )}
          {storage.folderOrder.map((id: string) => (
            <div
              key={id}
              onClick={(e) => {
                e.stopPropagation();
                storageModule.addGifToFolder(id, item.url);
                setOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#35373c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              style={{
                padding: "6px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                color: "#dbdee1",
                fontSize: "14px"
              }}
            >
              {storage.folders[id].name}
            </div>
          ))}
          {isInCurrentFolder && (
            <>
              <div style={{ height: "1px", background: "#1e1f22", margin: "4px 0" }} />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  storageModule.removeGifFromFolder(selectedFolder, item.url);
                  setOpen(false);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#35373c")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{
                  padding: "6px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "#f23f43",
                  fontSize: "14px"
                }}
              >
                Remove from folder
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export function renderGifExtras(item: any, original: any) {
  return (
    <>
      {original}
      <GifOverlay item={item} />
    </>
  );
}
