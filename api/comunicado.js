import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const { setor, titulo, mensagem, link } = req.body;

        if (!setor || !titulo || !mensagem || !link) {
            return res.status(400).json({ error: "Campos obrigatórios ausentes" });
        }

        const webhooks = {
            financeiro:
                "https://chat.googleapis.com/v1/spaces/AAAA5-k7fac/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=-selMF4dbxqccETz_-kz9Xf0pFQZwDLq8dQf4Q5Lfwc",
        };

        const webhook = webhooks[setor];
        if (!webhook) return res.status(404).json({ error: "Setor não encontrado" });

        const payload = {
            text: `Novo comunicado para ${setor.toUpperCase()}`,
            cardsV2: [
                {
                    cardId: `card-${setor}-${Date.now()}`,
                    card: {
                        header: {
                            title: `📢 ${titulo}`,
                            subtitle: `Setor: ${setor.toUpperCase()}`,
                            imageUrl: "https://img.icons8.com/office/80/megaphone.png",
                            imageType: "CIRCLE",
                        },
                        sections: [
                            {
                                header: "🧾 Detalhes",
                                widgets: [{ textParagraph: { text: mensagem } }],
                            },
                            {
                                widgets: [
                                    {
                                        buttonList: {
                                            buttons: [
                                                {
                                                    text: "Ver mais detalhes",
                                                    onClick: { openLink: { url: link } },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        };

        const response = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao enviar para o Google Chat: ${text}`);
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Erro:", err.message);
        res.status(500).json({ error: err.message });
    }
}
