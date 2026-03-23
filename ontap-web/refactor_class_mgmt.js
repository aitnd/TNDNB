const fs = require('fs');
const path = require('path');

const filePath = 'E:/Antigravity/TNDNB/ontap-web/components/ClassManagementScreen.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

// Arrays are 0-indexed. Line 1027 is index 1026.
const startLine = 1026; // Line 1027
const endLine = 2086;   // Line 2087

const props = `
        <ClassDetail
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            userProfile={userProfile}
            teachers={teachers}
            students={students}
            paginatedStudents={paginatedStudents}
            viewMode={viewMode}
            setViewMode={setViewMode}
            canAddTeachers={canAddTeachers}
            canRemoveTeachers={canRemoveTeachers}
            canManageStudents={canManageStudents}
            setShowAddTeacherModal={setShowAddTeacherModal}
            setShowAddStudentModal={setShowAddStudentModal}
            setShowImportModal={setShowImportModal}
            setShowManualCreateModal={setShowManualCreateModal}
            handleOpenNotifModal={handleOpenNotifModal}
            handleRemoveTeacherFromClass={handleRemoveTeacherFromClass}
            handleRemoveStudentFromClass={handleRemoveStudentFromClass}
            handleResetPassword={handleResetPassword}
            studentLatestResults={studentLatestResults}
            selectedForOffline={selectedForOffline}
            toggleSelectAllForOffline={toggleSelectAllForOffline}
            toggleSelectForOffline={toggleSelectForOffline}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            setEditStudent={setEditStudent}
            setShowEditStudentModal={setShowEditStudentModal}
            setHistoryStudent={setHistoryStudent}
            setShowHistoryModal={setShowHistoryModal}
            setSessionStudent={setSessionStudent}
            setShowSessionModal={setShowSessionModal}
            getRoleDisplayName={getRoleDisplayName}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            deviceCounts={deviceCounts}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            getFilteredAndSortedStudents={getFilteredAndSortedStudents}
            toggleOfflineAccess={toggleOfflineAccess}
            handleBulkToggleOffline={handleBulkToggleOffline}
            handleBulkResetPassword={handleBulkResetPassword}
            handleBulkRemoveFromClass={handleBulkRemoveFromClass}
            isBulkOfflineToggling={isBulkOfflineToggling}
            isBulkResetting={isBulkResetting}
            isBulkDeleting={isBulkDeleting}
            showBulkNotifModal={showBulkNotifModal}
            setShowBulkNotifModal={setShowBulkNotifModal}
            bulkNotifType={bulkNotifType}
            setBulkNotifType={setBulkNotifType}
            bulkNotifTitle={bulkNotifTitle}
            setBulkNotifTitle={setBulkNotifTitle}
            bulkNotifMessage={bulkNotifMessage}
            setBulkNotifMessage={setBulkNotifMessage}
            handleBulkSendNotification={handleBulkSendNotification}
            isSendingBulkNotif={isSendingBulkNotif}
            setSelectedForOffline={setSelectedForOffline}
            handleOpenSessionModal={handleOpenSessionModal}
        />
    );`;

// Surgery: Replace lines from startLine to endLine
content.splice(startLine, endLine - startLine + 1, props);

fs.writeFileSync(filePath, content.join('\n'));
console.log('Successfully refactored ClassManagementScreen.tsx');
