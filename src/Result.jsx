
import { Download } from "lucide-react";
function Result({ item }) {
    const downloadImage = async(url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${filename}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }
        catch (error) {
            console.error("Download Failed", error);
        }
    };
    return(
        <div className="image-card">
            <a href={item.links.html} target="_blank" rel="noreferrer">
                <img src={item.urls.small} alt={item.alt_description} />
            </a>

            <button
                className="download-btn"
                onClick={() => downloadImage(item.urls.full, `unsplash-${item.id}`)}
                title="Download high-res image"
            >
                <Download size={20} strokeWidth={2.5} />
            </button>
        </div>
    );
}

export default Result