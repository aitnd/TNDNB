/**
 * SavedAccountsList Component
 * Hiển thị danh sách tài khoản đã lưu với khả năng đăng nhập nhanh và xóa
 * UI giống Facebook với avatar, tên và nút xóa
 */

import React from 'react';
import { FaUserCircle, FaTimes, FaPlus } from 'react-icons/fa';
import { SavedAccount, removeAccount } from '../services/savedAccountsService';

interface SavedAccountsListProps {
    accounts: SavedAccount[];
    onSelectAccount: (account: SavedAccount) => void;
    onUseOtherAccount: () => void;
    onAccountRemoved: () => void;
}

const SavedAccountsList: React.FC<SavedAccountsListProps> = ({
    accounts,
    onSelectAccount,
    onUseOtherAccount,
    onAccountRemoved
}) => {
    // Xử lý xóa tài khoản
    const handleRemove = (e: React.MouseEvent, email: string) => {
        e.stopPropagation(); // Không trigger onSelectAccount
        removeAccount(email);
        onAccountRemoved();
    };

    return (
        <div className="space-y-3">
            {/* Danh sách tài khoản đã lưu */}
            {accounts.map((account) => (
                <div
                    key={account.email}
                    onClick={() => onSelectAccount(account)}
                    className="group flex items-center gap-3 p-3 bg-card hover:bg-muted rounded-xl cursor-pointer transition-all duration-200 border border-border hover:border-primary/50 hover:shadow-md"
                >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {account.photoURL ? (
                            <img
                                src={account.photoURL}
                                alt={account.displayName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }} loading="lazy" />
                        ) : null}
                        <FaUserCircle
                            className={`w-12 h-12 text-muted-foreground ${account.photoURL ? 'hidden' : ''}`}
                        />
                        {/* Badge cho tài khoản có lưu password */}
                        {account.hasPassword && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-card">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Thông tin tài khoản */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                            {account.displayName || 'Người dùng'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                            {account.email}
                        </p>
                    </div>

                    {/* Nút xóa */}
                    <button
                        onClick={(e) => handleRemove(e, account.email)}
                        className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa tài khoản khỏi danh sách"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>
            ))}

            {/* Nút sử dụng tài khoản khác */}
            <button
                onClick={onUseOtherAccount}
                className="w-full flex items-center justify-center gap-2 p-3 text-primary hover:bg-primary/10 rounded-xl transition-colors border-2 border-dashed border-primary/30 hover:border-primary"
            >
                <FaPlus className="w-4 h-4" />
                <span className="font-medium">Sử dụng tài khoản khác</span>
            </button>
        </div>
    );
};

export default SavedAccountsList;
