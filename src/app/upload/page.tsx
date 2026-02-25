import UploadForm from "@/components/upload-form";

export default function UploadPage() {
    return (
        <div className="container max-w-4xl mx-auto py-12">
            <div className="text-center mb-8">
                <h1 className="font-headline text-4xl font-bold">Upload Your Project</h1>
                <p className="text-muted-foreground mt-2">Showcase your latest creation to the world.</p>
            </div>
            <UploadForm />
        </div>
    );
}
