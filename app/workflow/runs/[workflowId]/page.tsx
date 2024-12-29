async function Page({ params }: { params: Promise<{ workflowId: string }> }) {
    const workflowId = (await params).workflowId;
    return <div>My Runs: {workflowId}</div>;
  }
  
  export default Page;
  