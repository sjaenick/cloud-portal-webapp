#!/bin/bash
WIKI_MOUNT_VOLUME=https://cloud.denbi.de/wiki/portal/volumes/#mount-a-volume
WIKI_GROUP_INVITATIONS=https://cloud.denbi.de/wiki/portal/project_overview/#inviting-members
WIKI_SNAPSHOTS=https://cloud.denbi.de/wiki/portal/snapshots/
WIKI=https://cloud.denbi.de/wiki/
WIKI_GENERATE_KEYS=https://cloud.denbi.de/wiki/quickstart/#generate-ssh-keys
WIKI_VOLUME_OVERVIEW=https://cloud.denbi.de/wiki/portal/volumes/
NEWS=https://cloud.denbi.de/news/
WIKI_EXTEND_VOLUME=https://cloud.denbi.de/portal/volumes/#extend-a-volume;

WIKI_LNKS=("$WIKI_VOLUME_OVERVIEW" "$WIKI_EXTEND_VOLUME" "$WIKI_MOUNT_VOLUME" "$WIKI_GROUP_INVITATIONS" "$WIKI_SNAPSHOTS" "$WIKI" "$WIKI_GENERATE_KEYS" "$NEWS")
for i in "${WIKI_LNKS[@]}"; do
  echo "$i"
  status_code=$(curl -o /dev/null -Isw '%{http_code}\n' "$i")
  if [[ "$status_code" -ne 200 ]]; then
    echo "Site status changed to $status_code"
    (exit 1)
  else
    echo Status: "$status_code"

  fi
done
