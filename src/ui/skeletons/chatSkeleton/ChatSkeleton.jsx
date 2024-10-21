import { Skeleton } from 'primereact/skeleton';
import React from 'react'
import './chatSkeleton.sass'

const ChatSkeleton = () => {
    return (
        <div className="chat-skeleton">
            <div className="border-round border-1 surface-border p-4">
                <ul className="m-0 p-0 list-none">
                    <li className="mb-3 mt-3">
                        <div className="flex">
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default ChatSkeleton