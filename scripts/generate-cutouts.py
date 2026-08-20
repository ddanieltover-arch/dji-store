"""Studio cutouts on #F5F5F7 — original geometric silhouettes, not DJI photography."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1] / "public" / "products"
BG = (245, 245, 247, 255)
INK = (45, 45, 48, 255)
ACCENT = (90, 90, 96, 255)
W, H = 900, 900

EXISTING = {
    "prod-mavic-4-pro",
    "prod-air-3s",
    "prod-mini-4-pro",
    "prod-avata-2",
    "prod-osmo-pocket-3",
    "prod-osmo-action-5-pro",
    "prod-inspire-3",
    "acc-bat-m4p",
    "acc-rc2",
    "acc-care-m4p",
}

COPIES = {
    "refurb-mini-4-pro": "prod-mini-4-pro-cutout.png",
    "refurb-air-3s": "prod-air-3s-cutout.png",
    "refurb-pocket-3": "prod-osmo-pocket-3-cutout.png",
}

IDS = [
    "prod-neo", "prod-flip", "prod-mini-4k", "prod-mini-3", "prod-mini-5-pro", "prod-mini-2-se",
    "prod-air-3", "prod-mavic-3-pro", "prod-mavic-3-classic", "prod-avata",
    "prod-goggles-3", "prod-goggles-n3", "prod-rc-motion-3",
    "prod-osmo-mobile-7", "prod-osmo-mobile-7p", "prod-osmo-360", "prod-osmo-action-4", "prod-osmo-nano",
    "prod-mic-mini", "prod-mic-2", "prod-dji-mic",
    "prod-power-1000", "prod-power-500", "prod-power-2000",
    "prod-matrice-4t", "prod-matrice-4e",
    "acc-nd-mini", "acc-props-neo", "acc-hub-air", "prod-rs4", "prod-rs4-pro", "prod-rs-4-mini", "prod-rs-5",
    "acc-fmk-m4p", "acc-bat-air", "acc-nd-air", "acc-fmk-mini", "acc-bat-mini", "acc-bat-avata",
    "acc-nd-flip", "acc-bat-neo", "acc-bat-pocket", "acc-tripod-pocket", "acc-filter-action",
    "acc-bat-360", "acc-case-rs", "acc-care-mini", "acc-care-air3s", "acc-care-action", "acc-care-inspire",
    "acc-nd-m4p", "acc-rc-n3", "acc-65w-car", "prod-robomaster-ep",
    "refurb-mini-4-pro", "refurb-air-3s", "refurb-pocket-3",
]


def drone(draw: ImageDraw.ImageDraw, seed: int) -> None:
    cx, cy = 450, 430
    arm = 210 + (seed % 40)
    draw.ellipse((cx - 70, cy - 40, cx + 70, cy + 50), fill=INK)
    for dx, dy in ((-arm, -arm), (arm, -arm), (-arm, arm), (arm, arm)):
        draw.line((cx, cy, cx + dx, cy + dy), fill=INK, width=18)
        r = 48 + (seed % 12)
        draw.ellipse((cx + dx - r, cy + dy - r, cx + dx + r, cy + dy + r), outline=ACCENT, width=10)
    draw.rounded_rectangle((cx - 28, cy - 90, cx + 28, cy - 20), 8, fill=ACCENT)


def handheld(draw: ImageDraw.ImageDraw, seed: int) -> None:
    draw.rounded_rectangle((380, 180, 520, 720), 40, fill=INK)
    draw.rounded_rectangle((400, 210, 500, 340), 16, fill=BG)
    draw.ellipse((410, 560, 490, 640), fill=ACCENT)


def battery(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle((300, 280, 600, 620), 24, fill=INK)
    draw.rectangle((360, 250, 540, 290), fill=ACCENT)


def box(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle((250, 260, 650, 640), 20, fill=INK)
    draw.polygon([(250, 260), (450, 180), (650, 260)], fill=ACCENT)


def mic(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle((410, 240, 490, 520), 40, fill=INK)
    draw.ellipse((390, 200, 510, 320), fill=ACCENT)
    draw.rectangle((430, 520, 470, 700), fill=INK)


def power(draw: ImageDraw.ImageDraw, seed: int) -> None:
    h = 380 + (seed % 80)
    draw.rounded_rectangle((220, 900 - h - 160, 680, 740), 28, fill=INK)
    draw.rounded_rectangle((260, 300, 640, 380), 12, fill=ACCENT)


def goggles(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle((200, 340, 700, 560), 80, fill=INK)
    draw.ellipse((240, 370, 430, 530), fill=BG)
    draw.ellipse((470, 370, 660, 530), fill=BG)


def gimbal(draw: ImageDraw.ImageDraw) -> None:
    draw.arc((280, 220, 620, 680), 20, 340, fill=INK, width=28)
    draw.rounded_rectangle((400, 360, 500, 780), 20, fill=INK)


def robot(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle((280, 300, 620, 620), 30, fill=INK)
    draw.ellipse((220, 540, 360, 680), fill=ACCENT)
    draw.ellipse((540, 540, 680, 680), fill=ACCENT)
    draw.ellipse((340, 360, 420, 440), fill=BG)
    draw.ellipse((480, 360, 560, 440), fill=BG)


def pick(pid: str, draw: ImageDraw.ImageDraw) -> None:
    seed = sum(ord(c) for c in pid)
    if "goggles" in pid:
        goggles(draw)
    elif "mic" in pid:
        mic(draw)
    elif "power" in pid or "65w" in pid:
        power(draw, seed)
    elif "rs" in pid or "case-rs" in pid:
        gimbal(draw)
    elif "robomaster" in pid:
        robot(draw)
    elif pid.startswith("acc-bat") or "battery" in pid:
        battery(draw)
    elif pid.startswith("acc-care") or pid.startswith("acc-nd") or pid.startswith("acc-fmk") or "hub" in pid or "filter" in pid or "props" in pid or "tripod" in pid:
        box(draw)
    elif "osmo" in pid or "pocket" in pid or "action" in pid or "mobile" in pid or "360" in pid:
        handheld(draw, seed)
    elif "rc" in pid or "motion" in pid:
        box(draw)
    else:
        drone(draw, seed)


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    for src_id, src_file in COPIES.items():
        src = ROOT / src_file
        dest = ROOT / f"{src_id}-cutout.png"
        if src.exists():
            Image.open(src).save(dest)

    for pid in IDS:
        dest = ROOT / f"{pid}-cutout.png"
        if pid in EXISTING and dest.exists():
            continue
        if pid in COPIES and dest.exists():
            continue
        img = Image.new("RGBA", (W, H), BG)
        draw = ImageDraw.Draw(img)
        pick(pid, draw)
        img.save(dest, "PNG")
        print("wrote", dest.name)


if __name__ == "__main__":
    main()
