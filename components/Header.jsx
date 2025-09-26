import Image from "next/image";

export default function Header() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-4">
          <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
          <h1 className="text-4xl font-bold text-balance">AI Summary Feed</h1>
        </div>
        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
          Transform your text into concise summaries powered by advanced AI.
          Share insights and discover what others are summarizing in real-time.
        </p>
      </div>
    </div>
  );
}
