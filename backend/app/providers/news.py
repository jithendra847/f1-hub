import httpx
import logging
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger("f1_providers.news")

class NewsArticleModel:
    def __init__(
        self,
        title: str,
        summary: str,
        source: str,
        article_url: str,
        category: str = "RACE",
        subtitle: Optional[str] = None,
        author: Optional[str] = None,
        image_url: Optional[str] = None,
        confidence_score: float = 1.0,
        provider: str = "RSSAdapter",
        verification_status: str = "VERIFIED",
        published_at: Optional[datetime] = None
    ):
        self.title = title
        self.summary = summary
        self.source = source
        self.article_url = article_url
        self.category = category
        self.subtitle = subtitle
        self.author = author
        self.image_url = image_url
        self.confidence_score = confidence_score
        self.provider = provider
        self.verification_status = verification_status
        self.published_at = published_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "subtitle": self.subtitle,
            "summary": self.summary,
            "author": self.author,
            "image_url": self.image_url,
            "source": self.source,
            "category": self.category,
            "article_url": self.article_url,
            "confidence_score": self.confidence_score,
            "provider": self.provider,
            "verification_status": self.verification_status,
            "published_at": self.published_at.isoformat()
        }

class NewsProvider:
    """
    Enterprise News Provider Architecture.
    Aggregates news from multiple pluggable news adapters.
    """
    def __init__(self):
        self.rss_feeds = [
            {"name": "Formula1.com Official", "url": "https://www.formula1.com/content/fom-website/en/latest/all.xml", "category": "RACE"},
            {"name": "FIA Media", "url": "https://www.fia.com/rss/news", "category": "FIA"},
            {"name": "Motorsport.com F1", "url": "https://www.motorsport.com/rss/f1/news/", "category": "TEAMS"}
        ]

    async def get_latest_news(self, limit: int = 20) -> List[Dict[str, Any]]:
        articles: List[NewsArticleModel] = []
        async with httpx.AsyncClient(timeout=8.0) as client:
            for feed in self.rss_feeds:
                try:
                    res = await client.get(feed["url"])
                    if res.status_code == 200:
                        root = ET.fromstring(res.text)
                        channel = root.find("channel")
                        if channel is not None:
                            for item in channel.findall("item")[:limit]:
                                title = item.findtext("title", "")
                                link = item.findtext("link", "")
                                desc = item.findtext("description", "")
                                pub_date_str = item.findtext("pubDate", "")
                                
                                if title and link:
                                    article = NewsArticleModel(
                                        title=title.strip(),
                                        summary=desc.strip()[:300] if desc else "F1 news summary.",
                                        source=feed["name"],
                                        article_url=link.strip(),
                                        category=feed["category"],
                                        provider="RSSAdapter",
                                        verification_status="VERIFIED"
                                    )
                                    articles.append(article)
                except Exception as e:
                    logger.warning(f"Failed to fetch RSS feed {feed['name']}: {e}")

        # Sort by published_at
        articles.sort(key=lambda a: a.published_at, reverse=True)
        return [a.to_dict() for a in articles[:limit]]
