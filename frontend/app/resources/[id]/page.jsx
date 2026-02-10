import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ResourceCard from '@/components/ResourceCard';
import { ChevronLeft, Clock, Share2, Bookmark } from 'lucide-react';

async function getArticle(id) {
    try {
        const res = await fetch(`http://localhost:5000/api/resources/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Error fetching article:", error);
        return null;
    }
}

async function getRelatedArticles(category, currentId) {
    try {
        const res = await fetch(`http://localhost:5000/api/resources?category=${category}`, { cache: 'no-store' });
        if (!res.ok) return [];
        const allInCategory = await res.json();
        // Filter out current article and take up to 3
        return allInCategory.filter(article => article.id !== currentId).slice(0, 3);
    } catch (error) {
        console.error("Error fetching related articles:", error);
        return [];
    }
}

export default async function ArticlePage({ params }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    const relatedArticles = await getRelatedArticles(article.category, article.id);

    const categoryLabels = {
        SAFE_SEX: "Safe Sex",
        CONSENT: "Consent",
        MENTAL_HEALTH: "Mental Health",
        SEXUAL_WELLBEING: "Sexual Wellbeing",
    };

    const categoryColors = {
        SAFE_SEX: "text-teal-600 bg-teal-50",
        CONSENT: "text-orange-600 bg-orange-50",
        MENTAL_HEALTH: "text-blue-600 bg-blue-50",
        SEXUAL_WELLBEING: "text-pink-600 bg-pink-50",
    };

    return (
        <main className="min-h-screen bg-background pb-20 transition-colors duration-300">
            <Navbar />

            {/* Back Button & Actions */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/resources"
                        className="flex items-center text-slate-500 hover:text-veri5-teal font-bold text-sm transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Resources
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-full bg-card text-muted-foreground hover:bg-muted transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-full bg-card text-muted-foreground hover:bg-muted transition-colors">
                            <Bookmark className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <article className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${categoryColors[article.category]}`}>
                                {categoryLabels[article.category] || article.category}
                            </span>
                            <div className="flex items-center text-muted-foreground text-xs font-medium">
                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                {article.readTime}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-8 leading-tight">
                            {article.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-10 max-w-3xl">
                            {article.description}
                        </p>

                        {article.imageUrl && (
                            <div className="rounded-4xl overflow-hidden shadow-2xl border border-border aspect-video md:aspect-[21/9]">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-lg lg:prose-xl prose-headings:text-foreground prose-headings:font-black prose-p:text-foreground/80 prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-veri5-teal prose-img:rounded-3xl">
                        {/* Split content by newlines and wrap in paragraphs if it doesn't look like HTML */}
                        {article.content.split('\n').filter(p => p.trim()).map((para, index) => (
                            <p key={index}>{para}</p>
                        ))}
                    </div>

                    <hr className="my-20 border-border" />

                    {/* Related Resources */}
                    {relatedArticles.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-foreground">Related Guides</h2>
                                <Link href={`/resources?category=${article.category}`} className="text-veri5-teal font-bold text-sm hover:underline uppercase tracking-wider">
                                    View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedArticles.map((rel) => (
                                    <ResourceCard key={rel.id} {...rel} />
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
}
