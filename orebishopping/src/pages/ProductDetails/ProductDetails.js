import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import { strapiApi } from "../../api/strapi";

const backendUrl = "http://localhost:1337";

const ProductDetails = () => {
  const { documentId } = useParams();
  console.log('[ProductDetails] useParams documentId:', documentId);
  const [productInfo, setProductInfo] = useState(null);
  const [prevLocation, setPrevLocation] = useState("");

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  useEffect(() => {
    console.log('[ProductDetails] Fetching product by documentId:', documentId);
    strapiApi.getProductByDocumentId(documentId).then(res => {
      console.log('[ProductDetails] API response:', res.data);
      setProductInfo(res.data.data[0]);
    });
    setPrevLocation(window.location.pathname);
  }, [documentId]);

  // Fetch comments when productInfo is loaded
  useEffect(() => {
    if (productInfo && productInfo.documentId) {
      strapiApi.getProductCommentsByDocumentId(productInfo.documentId)
        .then(res => {
          setComments(Array.isArray(res.data) ? res.data : (res.data.data || []));
        })
        .catch(() => setComments([]));
    }
  }, [productInfo]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError("");
    setCommentSuccess("");
    try {
      await strapiApi.postProductCommentByDocumentId(productInfo.documentId, {
        content: commentContent,
        // Optionally add authorName, email, etc. if your API allows
      });
      setCommentSuccess("Comment posted!");
      setCommentContent("");
      // Refresh comments
      const res = await strapiApi.getProductCommentsByDocumentId(productInfo.documentId);
      setComments(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (!productInfo) return <div>Loading...</div>;

  // Get image and description from API structure
  const imgUrl = productInfo.images?.[0]?.formats?.medium?.url
    ? backendUrl + productInfo.images[0].formats.medium.url
    : (productInfo.images?.[0]?.url ? backendUrl + productInfo.images[0].url : "");
  const description = productInfo.description?.[0]?.children?.[0]?.text || "";

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            {/* <ProductsOnSale /> */}
          </div>
          <div className="h-full xl:col-span-2">
            <img
              className="w-full h-full object-cover"
              src={imgUrl}
              alt={productInfo.name}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={{
              id: productInfo.id,
              name: productInfo.name,
              price: productInfo.price,
              description,
              image: imgUrl,
              color: productInfo.color,
              badge: productInfo.badge,
              stock: productInfo.stock,
              category: productInfo.category,
            }} />
          </div>
        </div>
        {/* Comments Section */}
        <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Comments & Reviews</h2>
          {comments.length === 0 && <div className="text-gray-500 mb-4">No comments yet. Be the first to comment!</div>}
          <ul className="mb-6">
            {comments.map((comment) => (
              <li key={comment.id} className="mb-4 border-b pb-2">
                <div className="font-semibold">{comment.author?.name || 'Anonymous'}</div>
                <div className="text-gray-700">{comment.content}</div>
                <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
            <textarea
              className="border rounded p-2"
              rows={3}
              placeholder="Leave a comment or review..."
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={commentLoading || !commentContent.trim()}
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
            {commentError && <div className="text-red-500 text-sm">{commentError}</div>}
            {commentSuccess && <div className="text-green-600 text-sm">{commentSuccess}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
