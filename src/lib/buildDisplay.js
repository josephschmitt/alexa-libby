export default function buildDisplay(title, image, text, text1) {
    return {
        "type": "Display.RenderTemplate",
        "template": {
            "type": "BodyTemplate3",
            "token": "movie",
            "backButton": "VISIBLE",
            "title": title,
            "textContent": {
                "primaryText": {
                    "text": text,
                    "type": "PlainText"
                },
                "secondaryText": {
                    "text": text1,
                    "type": "PlainText"
                }
            },
            "image": {
            "sources": [
                {
                    "url": image.smallImageUrl
                },
                {
                    "url": image.largeImageUrl
                }
                
            ]}
        }
    }
};