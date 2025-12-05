const testStr = `
1
00:00:04,004 --> 00:00:07,508
((新菜：わぁ…。

2
00:00:07,508 --> 00:00:09,676
きれいだろ？

3
00:00:09,676 --> 00:00:13,347
このお雛さん
じいちゃんたちが作ったんだぞ。

4
00:00:13,347 --> 00:00:15,349
すげぇだろ？

5
00:00:15,349 --> 00:03:20,520
うん　すごい…　すごい　きれい。

6
00:00:20,520 --> 00:00:25,025
世界で　一番きれい…。`;

const subsContent = document.getElementById("subs-content");
const subsList = document.getElementById("subs-list");
const sgTemplate = document.querySelector(".subs-group-template");
sgTemplate.classList.remove("subs-group-template");
const SubsList = {
  subs: {},
  init() {},

  set(subsStr) {
    const groups = this.parse(subsStr);
    this.clear();
    this.render(groups);
  },

  parse(str) {
    const lines = str.split("\n");
    let lineGroups = [];
    let subGroups = [];
    for (let line of lines) {
      // parse collected lines on empty line
      if (line === "") {
        // restart collecting when not enough lines
        if (lineGroups.length < 3) {
          console.info(
            `Not enough data in the sub group, expected at least 3 lines, got ${lineGroups.length} ${lineGroups}`,
          );
          lineGroups = [];
          continue;
        }

        // actual data parse & restart collecting
        subGroups.push(parseSubGroup(lineGroups));
        lineGroups = [];
        continue;
      }
      // collect line to group for later parsing
      lineGroups.push(line.trim());
    }
    return subGroups;
  },

  render(groups) {
    sgTemplate.style.display = "flex";
    for (let g of groups) {
      const li = sgTemplate.cloneNode(true);
      this.subs[g.ts.start.stamp] = {};
      this.subs[g.ts.start.stamp].data = g;
      this.subs[g.ts.start.stamp].node = li;
      li.dataset["ts"] = g.ts.start.stamp;

      const timeNode = li.querySelector(".subs-group-time");
      const { h, m, s } = g.ts.start;
      timeNode.textContent = `${h}:${m}:${s}`;

      const contentNode = li.querySelector(".subs-group-text");
      contentNode.textContent = g.content;

      subsList.appendChild(li);
    }
    sgTemplate.style.display = "none";
  },

  setSubClickCallback(fn) {
    subsList.addEventListener("click", (e) => {
      const sub = e.target.closest(".subs-group");
      if (sub) {
        const ts = parseFloat(sub.dataset["ts"]);
        fn(ts);
        this.updateCurrent(sub);
      }
    });
  },

  findSubByTimestamp(ts) {
    const stamps = Object.keys(this.subs);
    let check = Math.floor(stamps.length / 2);
    while (true) {
      let testStamp = this.subs[check].data.ts.start.stamp;
      if (check === stamps.length) return stamps[stamps.length - 1];
    }
  },

  updateCurrent(currentSub) {
    for (let sub of Object.keys(this.subs)) {
      this.subs[sub]?.node.classList.remove("current");
    }
    currentSub.classList.add("current");
  },

  clear() {
    while (subsList.firstChild) {
      subsList.removeChild(subsList.firstChild);
    }
    this.subs = {};
  },
};

function parseSubGroup([pos, timestamp, content]) {
  const [startStr, endStr] = timestamp.split(" --> ");
  const [start, end] = [parseTimestamp(startStr), parseTimestamp(endStr)];

  return {
    pos,
    content,
    ts: { start, end },
  };
}

function parseTimestamp(ts) {
  const [h, m, sms] = ts.split(":");
  const [s, ms] = sms.split(",");
  const stamp =
    parseFloat(ms) / 1000 +
    parseFloat(s) +
    parseFloat(m) * 60 +
    parseFloat(h) * 60 * 60;
  return {
    h,
    m,
    s,
    ms,
    stamp,
  };
}

SubsList.set(testStr);
