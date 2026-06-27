import React from "@moonlight-mod/wp/react";
import * as storageModule from "@moonlight-mod/wp/gifSorter_storage";
import { styles, globalCss, bg } from "@moonlight-mod/wp/gifSorter_styles";

const FOLDER_NAME_MAX_LENGTH = 16;

function FolderBar({ gifPickerThis }: { gifPickerThis: any }) {
  const storage = storageModule.getStorage();
  const [creating, setCreating] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [renaming, setRenaming] = React.useState(false);
  const [renameName, setRenameName] = React.useState("");

  const selectedFolder = storage.selectedFolder;
  const isFolderSelected = selectedFolder !== "all";

  return (
    <div style={styles.folderBar}>
      <style>{globalCss}</style>

      {/* Scrollable tabs */}
      <div className="gss-scroll" style={styles.tabScrollArea}>
        {/* "All" tab */}
        <button
          onClick={async () => {
            storageModule.setSelectedFolder("all");
            gifPickerThis.forceUpdate();
          }}
          style={styles.tabButton(selectedFolder === "all")}
        >
          All
        </button>

        {/* Folder tabs */}
        {storage.folderOrder.map((id: string) => (
          <button
            key={id}
            onClick={async () => {
              storageModule.setSelectedFolder(id);
              gifPickerThis.forceUpdate();
            }}
            style={styles.tabButton(selectedFolder === id)}
          >
            {storage.folders[id].name}
          </button>
        ))}

        {/* New folder name input */}
        {creating && (
          <input
            autoFocus
            className="gss-input"
            value={newFolderName}
            maxLength={FOLDER_NAME_MAX_LENGTH}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && newFolderName.trim().length > 0) {
                await storageModule.createFolder(newFolderName.trim());
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
            style={styles.tabInput}
          />
        )}

        {/* Rename folder input */}
        {renaming && isFolderSelected && (
          <input
            autoFocus
            className="gss-input"
            value={renameName}
            maxLength={FOLDER_NAME_MAX_LENGTH}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && renameName.trim().length > 0) {
                await storageModule.renameFolder(selectedFolder, renameName.trim());
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
            style={styles.tabInput}
          />
        )}
      </div>

      {/* Thin divider separating scroll area from fixed buttons */}
      <div style={styles.barDivider} />

      {/* Action buttons: anchored outside the scroll area, always visible */}
      <div style={styles.actionGroup}>
        {!creating && (
          <button
            onClick={() => {
              setRenaming(false);
              setCreating(true);
            }}
            style={styles.actionButton()}
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
            style={styles.actionButton()}
          >
            ✎
          </button>
        )}
        {isFolderSelected && (
          <button
            onClick={async () => {
              await storageModule.deleteFolder(selectedFolder);
              gifPickerThis.forceUpdate();
            }}
            style={styles.actionButton("danger")}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export function wrapContent(gifPickerThis: any, component: any) {
  const isFavorites = gifPickerThis.state.resultType === "Favorites";

  return (
    <div style={styles.contentWrapper}>
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
        style={styles.overlayHitArea}
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
          style={styles.overlayTrigger}
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
          style={styles.overlayDropdown}
        >
          {storage.folderOrder.length === 0 && <div style={styles.overlayEmptyText}>No folders yet</div>}
          {storage.folderOrder.map((id: string) => (
            <div
              key={id}
              onClick={async (e) => {
                e.stopPropagation();
                await storageModule.addGifToFolder(id, item.url);
                setOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = bg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              style={styles.overlayFolderItem}
            >
              {storage.folders[id].name}
            </div>
          ))}
          {isInCurrentFolder && (
            <>
              <div style={styles.overlayDivider} />
              <div
                onClick={async (e) => {
                  e.stopPropagation();
                  await storageModule.removeGifFromFolder(selectedFolder, item.url);
                  setOpen(false);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={styles.overlayRemoveItem}
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
