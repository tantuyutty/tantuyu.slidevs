---
theme: default
author: tantuyu
title: 入門網頁漏洞
description: 從 OWASP Top 10 到 XSS、SQL Injection、CSRF 的攻防實戰
date: 2025-10-02
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 入門網頁漏洞

20251002．tantuyu

---

## 目錄

<Toc columns="2" />

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

本課程所有內容僅供學術研究、教育訓練及防禦性安全測試之目的。

道德規範：我們強調所有技術的使用必須嚴格遵守 **道德駭客（Ethical Hacking）** 原則。

法律責任：課程中討論或實作的所有工具和技術（包括但不限於 Nmap, Burp Suite, sqlmap 等），絕不允許用於未經授權的系統、網路或網站。

您只能在以下環境進行測試：
  - 您完全擁有或管理的系統。
  - 經由明確且書面授權的目標。
  - 課程提供的 **靶場或靶機** 環境。

免責聲明：任何學員若將本課程知識用於非法目的或對未經授權的系統造成損害，須自行承擔全部法律責任。本課程講師與主辦單位對此不負任何連帶責任。

請在課程開始前，確認您已完全理解並同意遵守以上所有聲明。

---
layout: tty-middle
transition: slide-up
---

## 極．入門

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

### F12 DevTool

瀏覽器內建的除錯 / 檢查工具

<Image src="./F12_DevTool_example.png" height="240" />

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

（在不同瀏覽器上可能有不同的名稱欄位）

- Elements
- Console
- Network
- Application
- Sources
- ...

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

你說...這東西對駭客有用？

<Image src="./Thinking.jpg" height="180" />

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

對，有用，可以說只要牽扯到網頁、工程師、開發、資料等，幾乎在這裡可以找到問題

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

最近有個例子「[鏟子英雄](https://shovel-heroes.com/)」被爆

> 「前端居然能直接改變後端狀態，還能執行一堆未授權操作，可以隨意完成/取消人力需求，以及 CRUD 開一下 F12 所有人的電話都直接現形了」 -- 擷取自 [Threads 文](https://www.threads.com/@jaja.rifuci/post/DPO9EkiEka7?xmt=AQF0XEtDCF4wTb34yGv_9hxY083rP0gvF6RXsW5dputgeg&slof=1)

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

題外話，另個 Vibe Coding 的慘況，[去你的，Google 這招太奸詐了！](https://www.facebook.com/lady1211christy/posts/pfbid0Yuz52ioNrh3FLYB6r1CmVnHsENs1EDYbKSDos7etSE3YEPSiD9sf5zstN4AFk2ysl?rdid=c1Y4PkkQgeoGVmwR)

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

我知道各位怕刪文，所以我截圖了

<Image src="./Damn_you_Google.png" height="320" />

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

幫各位總結，這篇原文簡單直白來說就是：直接把密碼寫在程式碼當中。

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

F12 中的常用功能：

<v-clicks>

- Elements 元素：網頁的內容，僅可在 Client 端修改
- Console 控制台：執行 JavaScript、查看錯誤訊息
- Network 網路：可以看到網頁請求了什麼、引入了什麼、API 呼叫
- Application 應用程式：可以看到 Cookie、Storage 等
- Sources 原始碼：瀏覽前端 JS 程式碼、下中斷點、逐行 Debug

</v-clicks>

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

### Cookie vs Storage 差異整理

| 特性        | Cookie       | LocalStorage | SessionStorage |
| --------- | ------------ | ------------ | -------------- |
| 容量        | 幾 KB         | ~5–10 MB     | ~5–10 MB       |
| 存活時間      | 可設定到期日       | 永久（直到刪除）     | 分頁關閉即刪除        |
| 是否隨請求自動送出 | ✅ 會          | ❌ 不會         | ❌ 不會           |
| 常見用途      | Session、登入狀態 | 偏好設定、大量暫存    | 臨時資料、單次流程      |

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

### 恕我快速帶過程式語言的基礎語法 ><

```js
// 算術
1 + 2, 5 - 3, 2 * 3, 10 / 2, 5 % 2

// 比較（注意 == 與 === 差別）
"5" == 5    // true （會型別轉換）
"5" === 5   // false（純比較型別與值）

// 邏輯
true && false, true || false, !true
```

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

```js
// 條件
if (x > 5) {
  console.log("big");
} else if (x === 5) {
  console.log("equal");
} else {
  console.log("small");
}

// 迴圈
for (let i=0; i<3; i++) console.log(i);

let i = 0;
while (i < 3) { console.log(i); i++; }
```

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

所以... 來幾題簡單的 picoCTF 吧

- [Inspect HTML](https://play.picoctf.org/practice/challenge/275?category=1&page=1)
- [Includes](https://play.picoctf.org/practice/challenge/274?category=1&page=1)
- [Insp3ct0r](https://play.picoctf.org/practice/challenge/18?category=1&page=2)

###### tag: `Web`

---
hideInToc: true
layout: tty-middle
transition: slide-up
---

再來幾題稍微動腦、需要 Google 或 AI 幫忙的吧

- [dont-use-client-side](https://play.picoctf.org/practice/challenge/66?category=1&page=2)
- [logon](https://play.picoctf.org/practice/challenge/46?category=1&page=2)
- [Scavenger Hunt](https://play.picoctf.org/practice/challenge/161?category=1&page=2)

###### tag: `Web`

---
transition: slide-up
layout: tty-middle
---

## OWASP Top 10

1. Broken Access Control (XSS)
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery (SSRF)

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Broken Access Control (XSS) 權限控制失效

::top-left::
導致未經授權的用戶可以訪問敏感資料或功能，從而取得非預期提供的資訊。

::top-right::
防範方式：

- 嚴格限制存取權限。
- 定期測試存取控制規則。

::wrong-example::

```ts
https://example.com/userinfo/username=tantuyu
https://example.com/userinfo/username=admin
```

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Cryptographic Failures 加密機制失效

::top-left::
敏感資料未正確加密，或使用不安全的加密方法。

::top-right::
防範方式：

- 使用當代強加密方法（如 AES 或 TLS 1.2/1.3）
- 避免硬編碼加密密鑰。

::wrong-example::

- 使用過時的加密演算法（如 MD5）
- 未加密的敏感數據傳輸。

::right-example::

```
密碼 -> 雜湊/加密 -> 資料庫
```

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Injection 注入式攻擊

::top-left::
攻擊者透過未經驗證的輸入操縱查詢或指令（如 SQL injection、XSS 等）。

::top-right::
防範方式：

- 使用現代框架（如 React、Angular）自帶的防範機制，避免直接操作 DOM。
- 建立 HTML 的白名單標籤。
- 過濾並驗證用戶輸入。

::wrong-example::

```js
<script>alert(1);</script>
```

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Insecure Design 不安全設計

::top-left::
應用程式架構或設計缺乏安全考量。

::top-right::
防範方式：

- 在設計階段進行安全審查。
- 採用安全架構模式。

::wrong-example::
<LoginExample username="tantuyu" password="123456" />

::right-example::
系統提示：使用者名稱或密碼有誤。

或者可以再用 CAPTCHA 驗證或 2FA

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Security Misconfiguration 安全設定缺陷

::top-left::
不當的文件配置或任意權限使應用程式暴露在攻擊風險中。

::top-right::
防範方式：

- 關閉不必要的功能或服務。
- 定期檢查配置安全性。

::wrong-example::

```
https://example.com/.git
https://example.com/.env
https://example.com/access.log
https://example.com/.htaccess
```

::right-example::
敏感的配置內容都應該要避免公開，甚至能減少有這些敏感訊息都要盡量減少。也請勿將所有檔案權限改寫為 777

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Vulnerable and Outdated Components 危險或過舊的元件

::top-left::
使用具有已知漏洞的第三方元件、框架或作業系統

::top-right::
防範方式：

- 定期更新依賴元件或系統。
- 使用漏洞掃描工具。

::wrong-example::

- Windows 7
- MySQL 5.5
- Node.js 10.x

::right-example::
使用現今最新最穩定的版本（LTS），因為過去版本不再進行維護，過去的版本漏洞只會越找越多。因此要經常更新套件並維護專案。

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Identification and Authentication Failures 認證及驗證機制失效

::top-left::
使用者身分驗證或管理存在問題。

::top-right::
防範方式：

- 實現多因素認證
- 弱密碼檢查

::wrong-example::

- Token 暴露於 URL
- 弱密碼（12345678、qwertyuiop）
- 不能正確的失效 Session

::right-example::
使用強化過的密碼（如：至少一個特殊字元、大寫字母、數字）、使用 2FA、Passkey 等等，確保帳號是由帳號本人操作，以及有時限的 Session。

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Software and Data Integrity Failures 軟體及資料完整性失效

::top-left::
未檢查軟體和資料的完整性，導致可能被惡意操縱。

::top-right::
防範方式：

- 驗證軟體更新的簽名證
- 確保 CI/CD 管道的安全性

::wrong-example::

- 使用不受信任的依賴套件
- 未使用安全協議或未對更新檔案進行簽名驗證
- 缺乏數據完整性保護

::right-example::

- 對使用的套件進行來源和版本檢查
- 使用數字簽名或哈希驗證數據和檔案的完整性
- 對數據做加密檢查驗證

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Security Logging and Monitoring Failures 資安記錄及監控失效

::top-left::
缺乏適當的日誌記錄和監控，無法及時發現和回應攻擊。

::top-right::
防範方式：

- 設置集中式日誌管理。
- 定期審查安全日誌。

::wrong-example::

- 無 Log 檔紀錄
- 日誌內容資訊缺漏
- 日誌保存時間過短

::right-example::

- 對任意操作都記錄到日誌上
- 將重要資訊都寫進日誌（IP、操作、日期等）
- 依法保存日誌時限

---
hideInToc: true
transition: slide-up
layout: tty-four-grid
---

### Server-Side Request Forgery (SSRF) 伺服器端請求偽造

::top-left::
攻擊者誘使伺服器向未經授權的目的地發出請求。

::top-right::
防範方式：

- 定期檢查所有目錄及 API 權限
- 使用安全代理來處理外部請求

---

主要攻擊原理

<Image src="./SSRF_example.png" height="420" />

---
transition: slide-up
layout: tty-middle
---

## 網頁漏洞那麼多，到底怎麼戳戳漏洞？

---
transition: slide-up
layout: tty-middle
---

### 工具和情報不能少

- [ZeroDay](https://zeroday.hitcon.org/)
- [CVE](https://www.cve.org/)
- [CWE](https://cwe.mitre.org/)
- [Wappalyzer](https://www.wappalyzer.com/) [(Chrome Extension)](https://chromewebstore.google.com/detail/wappalyzer-technology-pro/gppongmhjkpfnbhagpmjfkannfbllamg)

---
transition: slide-up
layout: tty-middle
---

### ZeroDay Example

1. [台灣工業與應用數學會 Vite 任意檔案讀取漏洞](https://zeroday.hitcon.org/vulnerability/ZD-2025-01167)
2. [ischool 澔學學習股份有限公司 存取控制缺陷](https://zeroday.hitcon.org/vulnerability/ZD-2025-01171)

---
layout: tty-middle
---

### CWE vs CVE

CWE 可以理解為類別

CVE 可以理解為實例

- [CWE-79 (XSS)](https://cwe.mitre.org/data/definitions/79.html)
- [CWE-89 (SQL Injection)](https://cwe.mitre.org/data/definitions/89.html)
- [CVE-2024-49038](https://www.cve.org/CVERecord?id=CVE-2024-49038)
- [CVE-2023-32530](https://www.cve.org/CVERecord?id=CVE-2023-32530)

---
transition: slide-up
layout: tty-middle
---

## 攻擊範例

> 拜託別亂打、會出事
>
> ~~要打請先事先告知（或掛 VPN、跳板）~~

---
transition: slide-up
layout: tty-middle
---

### XSS Example

```html
<script>alert("XSS success")</script>
```

```html
<q onmouseover=alert(1)>鼠標移過我</q>
```

```html
<svg onload=alert(1)>
```

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

三個細分類型

<v-clicks>

- Reflected XSS（反射型）
- Stored XSS（儲存型）
- DOM-based XSS（基於 DOM）

</v-clicks>

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

1. Reflected XSS（反射型）

惡意腳本隨請求（如 query string、form）被伺服器回傳並立即在回應中執行。

特點：不儲存在伺服器，需誘導使用者點擊精心構造的 URL。

Example: 釣魚網站

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

2. Stored XSS（儲存型）

惡意腳本被永久儲存在伺服器（資料庫、留言板、user profile 等），任何查看該內容的使用者都會執行該腳本。

特點：破壞力較大，能影響多數使用者或高權限帳號。

Example: 留言板、個人簡介等注入

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

3. DOM-based XSS（基於 DOM）

攻擊點完全在客戶端（JavaScript），例如前端直接把 location.hash、location.search、或其他 DOM 值寫入 innerHTML，沒有經過 server-side 回應。

其通常配合前兩者發生

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

### 你一定想說... 就區區一個 alert 可以幹嘛？

駭客可以利用 JS 將 Cookie 或其他帶有敏感訊息的資料送回攻擊者的伺服器。

---
transition: slide-up
layout: tty-middle
---

### SQL Injection Example

先來認識 SQL 是什麼

> SQL（Structured Query Language，結構化查詢語言）是一種**用來和資料庫溝通的語言**。 -- ChatGPT

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

獲取所有使用者（user）

```sql
SELECT * FROM users;
```

獲取所有使用者（user），條件是當 id=1 時

```sql
SELECT * FROM users WHERE id=1;
```

獲取所有使用者（user），條件是當 id=1 且 username="tantuyu"

```sql
SELECT * FROM users WHERE id=1 AND username="tantuyu";
```

新增一個使用者 username 為 tantuyu，密碼為 tantuyu

```sql
INSERT INTO users (username, password) VALUES ("tantuyu", "tantuyu");
```

SQL 的註解寫法：`--`

```sql
-- 我是註解，不會被執行
```

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

如果你對資料庫的 CURD 操作有興趣，可以到 [SQLBolt](https://sqlbolt.com/) 學習，或是到 LeetCode 刷題。

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

假設後端是 Python 寫的，然後其登入功能做查詢時的語法是以下語法

```py
sql = f"SELECT * FROM users WHERE username = '{input_username}' AND password = '{input_password}';"
cur.execute(sql)
user = cur.fetchone()

if user:
  # ...
  return session
```

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

1. 要解決查詢條件，那就先字串閉合
2. 字串閉合後，我們再創建一個為 `true` 的判斷式，並用 `OR` 連接
3. 最後把剩餘的註解掉

<div v-click>
聽不懂嗎...
</div>

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

那我們來看看駭客會怎麼輸入

input_username
<div v-click>
```
' OR 1=1;--
```
</div>
input_password
<div v-click>
```
You can type anything
```
</div>

````md magic-move
```py
f"SELECT * FROM users WHERE username = '{input_username}' AND password = '{input_password}';"
```

```sql
SELECT * FROM users WHERE username = '' OR 1=1;--' AND password = 'You can type anything';
```
````

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

```sql
SELECT * FROM users WHERE username = '' OR 1=1;--' AND password = 'You can type anything';
```

欸？你發現你登入成功了！

因為條件 `username = '' OR 1=1` 為恆真，而我在最後寫了 `;--` 來閉合 SQL 語法並註解後面其他條件，所以我必定會獲得一個登入的 session。

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

以上 <Link to="35">XSS Example</Link> 跟 <Link to="41">SQL Injection Example</Link> 我個人覺得比較有趣且好入門

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

接下來我們來講點比較進階億點點的

<Image src="./A_little_billion.png" height="240" />

---
transition: slide-up
layout: tty-middle
---

### Cross-Site Request Forgery (CSRF)

翻成中文叫做**跨站請求偽造**，據說還被稱作：**one-click attack**

1. **跨站**：是發生漏洞的地點，並不在目標網站上。
2. **請求偽造**：有心人士利用你在惡意網站填的資料，進行修改，並成功請求。

其行為就是釣魚網站上可能發生的事情

<!-- 簡單來說，CSRF 攻擊就是利用使用者已登入的身分，在使用者不知情的情況下執行惡意操作。通常是由有心人士開發了一個網站，並利用了你瀏覽器上的 Cookie 進行濫用。
尤其是金流及竊取隱私資料
 -->

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

發生的條件：

1. 目標網站只以單一條件驗證網站身份（只驗證 cookie 或 token）
2. 沒有驗證請求來源

<Image src="./CSRF_example.png" height="240" />

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

順帶一提，來說說網站會觸發腳本的方式：

- 點擊：`onclick`
- 滑鼠移過：`onmouseover`
- 網頁卷軸滾動：`onscroll`
- 拖拉元素：`ondrag`
- ...

---
hideInToc: true
transition: slide-left
layout: tty-middle
---

所以現在你是不是不敢亂點網頁了呢？

<Image src="./Scared.png" height="240" />

---
transition: slide-up
layout: tty-middle
---

## 防禦範例

> 如果你想當網頁工程師，要認真讀啊
>
> ~~或是假裝不知道，等到出事了再解決~~

---
transition: slide-up
layout: tty-middle
---

### XSS Defense

目標：禁止執行惡意腳本

- 建立白名單，輸入框只允許某些寫法
- 不使用像是 `innerHTML`、PHP 的直接回傳字串：`'Hello, '.$_GET['name'];` 等
- 使用 HTML 特殊字元編碼：`&lt;`、`&gt;`、`&quot;` 來代替 `<`、`>`、`"` 等
- 使用現今流行的框架撰寫

---
transition: slide-up
layout: tty-middle
---

### SQL Injection Defense

目標：禁止執行惡意腳本

- 使用參數化查詢，例如：`INSERT INTO users (username, email) VALUES (?, ?);`
- 建立白名單
- 不顯示錯誤訊息（可能嘗試攻擊後，給了一個內部執行結果的 Error）
- 使用現今流行的 ORM（物件關聯對映）

---
transition: slide-left
layout: tty-middle-two-grids-bottom
---

### CSRF Defense

目標：禁止其他來源的請求

::br::

身為工程師：

- 檢查 Referer Header，只允許特定網域的請求
- 表單或是相關的 API 請求添加隨機 Token
- 使用現今流行的框架

::bl::

身為使用者：

- 及時登出，可以減少 Cookie 上的登入狀態被竊取
- 啟用雙因子驗證（2FA）

---
transition: slide-up
layout: tty-middle
---

## 其他工具介紹

請勿隨意對任何網站使用任何有侵入、滲透等工具！

<div v-click class="text-red-500">
認真的
</div>

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

- [Nmap](https://nmap.org/) 網路掃描/偵測工具，檢測主機、開放端口、運行的服務與版本
- [sqlmap](https://github.com/sqlmapproject/sqlmap) 自動化 SQL Injection 偵測與利用工具
- [Burp Suite](https://portswigger.net/burp) 抓包、滲透測試、漏洞檢測工具
- [Wireshark](https://www.wireshark.org/) 網路協定分析器，捕捉和檢查網路數據封包
- [OSINT Framework](https://osintframework.com/) 蒐集公開資訊的工具
- [dirsearch](https://github.com/maurosoria/dirsearch) 路徑爆破工具
- [CyberChef](https://gchq.github.io/CyberChef/) 加密、解密、雜湊等
- [jwt](https://www.jwt.io/) 解 JWT 用的
- ...

---
transition: slide-up
layout: tty-middle
---

### Nmap Example

```bash
nmap [掃描類型] [選項] <IP>
```

```bash
nmap <IP>
nmap -O <IP>  # 作業系統偵測
nmap -sV <IP>  # 服務和版本偵測
nmap -sC <IP>  # 腳本掃描
nmap -A <IP>  # 包含前三者
```

---
transition: slide-up
layout: tty-middle
---

### sqlmap Example

```bash
sqlmap -u "<目標網址>" [選項]
```

```bash
sqlmap -u "http://example.com/article.php?id=10"
```

一旦發現有 SQL 漏洞，你還可以訪問資料庫名稱、更甚至資料表的資料

```bash
sqlmap -u "http://example.com/article.php?id=10" --dbs
sqlmap -u "http://example.com/article.php?id=10" -D usersdb --tables
sqlmap -u "http://example.com/article.php?id=10" -D usersdb -T user_info --columns
sqlmap -u "http://example.com/article.php?id=10" -D usersdb -T user_info --dump
```

---
hideInToc: true
transition: slide-up
layout: tty-middle
---

## 感謝各位參與

以上簡報內容有部分約 10% 的 ChatGPT 提供資訊，若有誤請麻煩告知我

Email: <a href="mailto:hi@ttymayor.com?subject=【回饋】">hi@ttymayor.com</a>
