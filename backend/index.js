// const express = require("express");
// const puppeteer = require("puppeteer");
// const cheerio = require("cheerio");
// const cors = require("cors");

// const app = express();

// const port = 5000;

// app.use(express.json());
// app.use(cors());

// app.post("/scrape-products", async (req, res) => {
//   let browser;
//   try {
//     const { websiteUrl } = req.body;
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.goto(websiteUrl, {
//       waitUntil: "domcontentloaded",
//       timeout: 15000,
//     });
//     const html = await page.content();
//     const $ = cheerio.load(html);
//     let queue = [];
//     let visited = new Set();
//     $("a").each((i, el) => {
//       const href = $(el).attr("href");
//       if (!href) return;
//       try {
//         const fullUrl = new URL(href, websiteUrl).href;
//         queue.push(fullUrl);
//       } catch {}
//     });

//     let products = [];
//     const MAX_CONCURRENT = 10;
//     while (queue.length > 0 && visited.size < 100) {
//       const batch = queue.splice(0, MAX_CONCURRENT);
//       const results = await Promise.all(
//         batch.map(async (current) => {
//           if (visited.has(current)) return null;
//           visited.add(current);
//           try {
//             const p = await browser.newPage();
//             await p.goto(current, {
//               waitUntil: "domcontentloaded",
//               timeout: 15000,
//             });
//             const pageHtml = await p.content();
//             const $$ = cheerio.load(pageHtml);
//             const title = $$("h1,h2,.product-title,.title")
//               .first()
//               .text()
//               .trim();
//             const description = $$(".description,p,.product-description")
//               .first()
//               .text()
//               .trim();

//               let image =

//     $$(
//         'meta[property="og:image"]'
//     ).attr(
//         "content"
//     ) ||

//     $$(
//         ".product img, .product-image img, img"
//     )
//         .first()
//         .attr(
//             "src"
//         ) ||

//     $$(
//         "img"
//     )
//         .first()
//         .attr(
//             "src"
//         );

// if (
//     image &&
//     !image.startsWith(
//         "http"
//     )
// ) {

//     image =
//         new URL(
//             image,
//             current
//         ).href;
// }
//             const links = [];
//             $$("a").each((i, e) => {
//               const href = $$(e).attr("href");
//               if (!href) return;
//               try {
//                 const full = new URL(href, websiteUrl).href;
//                 links.push(full);
//               } catch {}
//             });

//             await p.close();
//             return {
//               product:
//                 title &&
//                 (current.includes("product") ||
//                   current.includes("shop") ||
//                   current.includes("strip"))
//                   ? { name: title, description,image, url: current }
//                   : null,
//               links,
//             };
//           } catch {
//             return null;
//           }
//         }),
//       );

//       results.forEach((item) => {
//         if (!item) return;
//         if (item.product) {
//           products.push(item.product);
//         }
//         queue.push(...item.links);
//       });
//     }

//     products = [...new Map(products.map((p) => [p.name, p])).values()];
//     res.json({ success: true, total: products.length, products });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   } finally {
//     if (browser) await browser.close();
//   }
// });

// app.listen(port, () => console.log(`server is running on port ${port}.`));



const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/test",(req,res)=>{
    return({success:true,message:"API Working..."});
});

app.post("/scrape-products", async (req, res) => {

    let browser;

    try {

        const { websiteUrl } = req.body;

        if (!websiteUrl) {
            return res.status(400).json({
                success: false,
                message: "websiteUrl required"
            });
        }

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        });

        const page =
            await browser.newPage();

        await page.goto(
            websiteUrl,
            {
                waitUntil:
                    "domcontentloaded",
                timeout: 15000
            }
        );

        const html =
            await page.content();

        const $ =
            cheerio.load(
                html
            );

        let queue =
            [];

        let queued =
            new Set();

        let visited =
            new Set();

        $("a").each(
            (i, el) => {

                const href =
                    $(el).attr(
                        "href"
                    );

                if (!href)
                    return;

                try {

                    const full =
                        new URL(
                            href,
                            websiteUrl
                        ).href;

                    if (
                        !queued.has(
                            full
                        )
                    ) {

                        queue.push(
                            full
                        );

                        queued.add(
                            full
                        );
                    }

                } catch {}
            }
        );

        let products =
            [];

        const MAX_CONCURRENT =
            10;

        while (
            queue.length >
                0 &&
            visited.size <
                100
        ) {

            const batch =
                queue.splice(
                    0,
                    MAX_CONCURRENT
                );

            const results =
                await Promise.all(

                    batch.map(
                        async current => {

                            if (
                                visited.has(
                                    current
                                )
                            ) {
                                return null;
                            }

                            visited.add(
                                current
                            );

                            let p;

                            try {

                                p =
                                    await browser.newPage();

                                await p.goto(
                                    current,
                                    {
                                        waitUntil:
                                            "domcontentloaded",
                                        timeout:
                                            10000
                                    }
                                );

                                const html =
                                    await p.content();

                                const $$ =
                                    cheerio.load(
                                        html
                                    );

                                const title =
                                    $$(
                                        "h1,h2,.product-title,.title"
                                    )
                                        .first()
                                        .text()
                                        .trim();

                                const description =
                                    $$(
                                        ".description,p,.product-description"
                                    )
                                        .first()
                                        .text()
                                        .trim();

                                let image =

                                    $$(
                                        'meta[property="og:image"]'
                                    ).attr(
                                        "content"
                                    ) ||

                                    $$(
                                        ".product img,.product-image img,img"
                                    )
                                        .first()
                                        .attr(
                                            "src"
                                        );

                                if (
                                    image &&
                                    !image.startsWith(
                                        "http"
                                    )
                                ) {

                                    image =
                                        new URL(
                                            image,
                                            current
                                        ).href;
                                }

                                const links =
                                    [];

                                $$(
                                    "a"
                                ).each(
                                    (
                                        i,
                                        e
                                    ) => {

                                        const href =
                                            $$(
                                                e
                                            ).attr(
                                                "href"
                                            );

                                        if (
                                            !href
                                        )
                                            return;

                                        try {

                                            const full =
                                                new URL(
                                                    href,
                                                    websiteUrl
                                                ).href;

                                            if (
                                                !queued.has(
                                                    full
                                                )
                                            ) {

                                                links.push(
                                                    full
                                                );

                                                queued.add(
                                                    full
                                                );
                                            }

                                        } catch {}
                                    }
                                );

                                const isProduct =

                                    current.includes(
                                        "product"
                                    ) ||

                                    current.includes(
                                        "shop"
                                    ) ||

                                    current.includes(
                                        "item"
                                    ) ||

                                    current.includes(
                                        "collection"
                                    ) ||

                                    title;

                                return {

                                    product:
                                        isProduct
                                            ? {
                                                name:
                                                    title,

                                                description,

                                                image,

                                                url:
                                                    current
                                            }
                                            : null,

                                    links
                                };

                            } catch {

                                return null;

                            } finally {

                                if (p)
                                    await p.close();
                            }
                        }
                    )
                );

            results.forEach(
                item => {

                    if (!item)
                        return;

                    if (
                        item.product &&
                        item.product.name
                    ) {

                        products.push(
                            item.product
                        );
                    }

                    queue.push(
                        ...item.links
                    );
                }
            );
        }

        products =
            [
                ...new Map(
                    products.map(
                        p => [
                            p.url,
                            p
                        ]
                    )
                ).values()
            ];

        res.json({
            success: true,
            total:
                products.length,
            products
        });

    } catch (err) {

        res.status(
            500
        ).json({
            success: false,
            error:
                err.message
        });

    } finally {

        if (browser)
            await browser.close();
    }
});

app.listen(
    port,
    () =>
        console.log(
            `Server running ${port}`
        )
);