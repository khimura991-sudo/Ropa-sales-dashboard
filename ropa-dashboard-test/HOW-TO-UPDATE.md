# ROPA Dashboard (test version) — hosting and updating

This version has **no sign-in**. The page shows whatever is in `data.json` next to `index.html`. Anyone with the website address can see it, so keep the address within your team. Borrower names are left out.

## 1. Put it online (Netlify, about 5 minutes)

1. Unzip `ropa-dashboard-test.zip`.
2. Go to **app.netlify.com** and sign up (free).
3. **Sites → Add new site → Deploy manually.** Drag the unzipped folder into the box.
4. **Site configuration → Change site name** → e.g. `ropa-dashboard-gdfi`. Your address becomes `https://ropa-dashboard-gdfi.netlify.app`.

The `data.json` included is the data as of **Oct 27, 1:49 PM**.

## 2. One-time setup: an "Export dashboard data" flow (about 10 minutes)

This creates a fresh `data.json` from ROPA MONITORING.xlsx in your OneDrive, without opening anything.

**a. Add the script to Excel**
1. Open ROPA MONITORING.xlsx in **Excel for the web** (excel.office.com).
2. **Automate** tab → **New Script**.
3. Delete what's in the editor, paste everything from `export-data-script.ts`, and rename the script (top of the editor) to **Export dashboard data**. Click **Save script**.
4. Click **Run** once to test. It should finish with no errors.

**b. Create the flow in Power Automate**
1. Go to **make.powerautomate.com → Create → Instant cloud flow**. Name it `Export ROPA data`, choose **Manually trigger a flow**, then **Create**.
   - To have it run on its own instead, choose **Scheduled cloud flow** (e.g. every day at 7 AM).
2. **+ New step → Excel Online (Business) → Run script**:
   - Location: **OneDrive for Business** · Document Library: **OneDrive** · File: **/ROPA MONITORING.xlsx** · Script: **Export dashboard data**
3. **+ New step → OneDrive for Business → Create file**:
   - Folder Path: `/ROPA Dashboard` · File Name: `data.json`
   - File Content: pick **result** from the *Run script* step.
4. In the *Create file* step's **⋯ → Settings**, there's nothing to change. If the flow later says the file already exists, add a **Delete file** step before *Create file* for `/ROPA Dashboard/data.json` (set it to continue on failure).
5. **Save**, then **Test → Manually**. A `data.json` appears in OneDrive → ROPA Dashboard.

Both actions use standard Power Automate connectors included with Microsoft 365 business plans.

## 3. Updating the website

1. Run the flow (or let the schedule run it).
2. Download `data.json` from OneDrive → ROPA Dashboard.
3. Put it in your website folder, replacing the old one.
4. In Netlify, open your site → **Deploys**, and drag the folder in again. Same address, new numbers.

Anyone with the page open sees the new numbers within 5 minutes; the page re-checks `data.json` by itself. The "Data as of" time at the top shows when the data was exported.

## Next step after testing

Steps 2–3 still need a manual upload. For a dashboard that updates with no manual steps, switch to the **sign-in version** (`ropa-dashboard-site.zip` + `SETUP.md`). It reads the Excel file directly, so there's no data.json to upload, and the data isn't public.
