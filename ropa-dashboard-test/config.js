// ROPA Dashboard (test version, no sign-in). The page reads data.json from the same folder.
window.ROPA_CONFIG = {
  dataFile: "data.json",
  recoveryTarget: 0.83,
  inventoryTarget: 360,
  // How often an open page re-reads data.json (minutes). 0 turns it off.
  autoRefreshMinutes: 5,
};
