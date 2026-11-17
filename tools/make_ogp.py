"""X などでリンクを貼ったときに表示されるカード画像（ogp.png, 1200x630）と、
アイコン（icon.png, 180x180）を作るスクリプト。
使い方: python tools/make_ogp.py   （kidoku-game フォルダで実行）
"""
from PIL import Image, ImageDraw, ImageFont
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
FONT_B = "C:/Windows/Fonts/BIZ-UDGothicB.ttc"
FONT_R = "C:/Windows/Fonts/BIZ-UDGothicR.ttc"

PINK = (255, 90, 122)
TEXT = (29, 29, 31)
SUB = (92, 101, 117)
MINE = (142, 224, 138)
THEIR = (255, 255, 255)
CHAT_BG = (159, 182, 212)


def font(path, size):
    return ImageFont.truetype(path, size)


def gradient(w, h, top, bottom):
    img = Image.new("RGB", (w, h), top)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / (h - 1)
        c = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (w, y)], fill=c)
    return img


def bubble(d, x, y, text, f, fill, right=False, pad=(28, 18)):
    tw = d.textlength(text, font=f)
    th = f.size
    w, h = tw + pad[0] * 2, th + pad[1] * 2
    x0 = x - w if right else x
    d.rounded_rectangle([x0, y, x0 + w, y + h], radius=h // 2, fill=fill)
    d.text((x0 + pad[0], y + pad[1] - 2), text, font=f, fill=TEXT)
    return x0, y, x0 + w, y + h


def make_ogp():
    W, H = 1200, 630
    img = gradient(W, H, (255, 246, 248), (255, 222, 231))
    d = ImageDraw.Draw(img)

    # 右側：スマホのトーク画面
    px, py, pw, ph = 720, 60, 400, 510
    d.rounded_rectangle([px, py, px + pw, py + ph], radius=36, fill=CHAT_BG)
    d.rounded_rectangle([px, py, px + pw, py + 70], radius=36, fill=(43, 52, 69))
    d.rectangle([px, py + 40, px + pw, py + 70], fill=(43, 52, 69))
    d.text((px + 28, py + 20), "気になる人", font=font(FONT_B, 28), fill=(255, 255, 255))

    fb = font(FONT_R, 28)
    bubble(d, px + 24, py + 100, "今度ごはん行かない？", fb, THEIR)
    # 自分の返信（入力欄）
    d.rounded_rectangle([px + 20, py + ph - 96, px + pw - 20, py + ph - 24], radius=36, fill=(255, 255, 255))
    d.text((px + 48, py + ph - 76), "行きたい！", font=fb, fill=TEXT)
    d.line([(px + 48 + d.textlength("行きたい！", font=fb) + 4, py + ph - 78),
            (px + 48 + d.textlength("行きたい！", font=fb) + 4, py + ph - 44)], fill=PINK, width=3)
    d.rounded_rectangle([px + pw - 130, py + ph - 88, px + pw - 30, py + ph - 32], radius=28, fill=PINK)
    d.text((px + pw - 108, py + ph - 76), "送信", font=font(FONT_B, 28), fill=(255, 255, 255))
    # 既読タイマー
    d.text((px + pw // 2, py + 300), "既読をつけてから", font=font(FONT_R, 24), fill=(51, 65, 90), anchor="mm")
    d.text((px + pw // 2, py + 360), "23分", font=font(FONT_B, 72), fill=TEXT, anchor="mm")

    # 左側：タイトル
    d.text((70, 120), "既読から", font=font(FONT_B, 104), fill=TEXT)
    d.text((70, 240), "何分？", font=font(FONT_B, 124), fill=PINK)
    fs = font(FONT_R, 34)
    d.text((74, 420), "返信のちょうどいいタイミング、", font=fs, fill=SUB)
    d.text((74, 468), "あなたはわかる？", font=fs, fill=SUB)
    d.rounded_rectangle([70, 530, 400, 582], radius=26, fill=PINK)
    d.text((235, 556), "ブラウザで今すぐ遊べる", font=font(FONT_B, 24), fill=(255, 255, 255), anchor="mm")

    img.save(os.path.join(OUT, "ogp.png"), optimize=True)


def make_icon():
    S = 180
    img = Image.new("RGB", (S, S), PINK)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([22, 40, 158, 120], radius=40, fill=MINE)
    d.polygon([(120, 110), (150, 140), (100, 118)], fill=MINE)
    d.text((90, 80), "既読", font=font(FONT_B, 44), fill=TEXT, anchor="mm")
    img.save(os.path.join(OUT, "icon.png"), optimize=True)


if __name__ == "__main__":
    make_ogp()
    make_icon()
    print("ok")
